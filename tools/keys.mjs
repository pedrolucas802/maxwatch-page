#!/usr/bin/env node
// Beta access keys for maxwatch.pro. Run on your own computer, never in CI.
//   node tools/keys.mjs release v0.2.0 maxwatch-linux-x86_64.tar.gz maxwatch-linux-aarch64.tar.gz
//   node tools/keys.mjs add "Name of tester"     -> prints a new key
//   node tools/keys.mjs remove MW-XXXX-...       -> revokes it
//   node tools/keys.mjs list
// Private files (tools/secret.json, tools/keys.private.json) are gitignored: back them up, never commit them.
import { createCipheriv, createHash, pbkdf2Sync, randomBytes } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const SECRET = join(dir, 'secret.json'), PRIVATE = join(dir, 'keys.private.json'), PUBLIC = join(dir, '..', 'keys.json');
const REPO = 'https://github.com/pedrolucas802/maxwatch-page/releases/download/';
const FILE_ITER = 200000, KEY_ITER = 150000;
const read = (f, d) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : d);
const save = (f, v) => writeFileSync(f, JSON.stringify(v, null, 2) + '\n');
export const norm = (k) => k.toUpperCase().replace(/[^0-9A-Z]/g, '');

// Same format as `openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -md sha256`, so testers decrypt with stock openssl.
export async function encryptFile(src, dst, password) {
  const salt = randomBytes(8);
  const km = pbkdf2Sync(password, salt, FILE_ITER, 48, 'sha256');
  const out = createWriteStream(dst);
  out.write(Buffer.concat([Buffer.from('Salted__'), salt]));
  await pipeline(createReadStream(src), createCipheriv('aes-256-cbc', km.subarray(0, 32), km.subarray(32)), out);
}

// One public entry per key: sha256(key) to find it, and the release secret sealed with AES-GCM under that key.
export function seal(key, payload) {
  const k = norm(key), salt = randomBytes(16), iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', pbkdf2Sync(k, salt, KEY_ITER, 32, 'sha256'), iv);
  const ct = Buffer.concat([c.update(JSON.stringify(payload)), c.final(), c.getAuthTag()]);
  return { h: createHash('sha256').update(k).digest('hex'), s: salt.toString('base64'), i: iv.toString('base64'), c: ct.toString('base64') };
}

function build() {
  const secret = read(SECRET, null), keys = read(PRIVATE, []);
  if (!secret) throw new Error('No release yet: run "release" first.');
  save(PUBLIC, { v: 1, iter: KEY_ITER, entries: keys.map((t) => seal(t.key, { ...secret, name: t.name })) });
  console.log(`keys.json: ${keys.length} key(s) for ${secret.version}. Commit and push keys.json.`);
}

function newKey() {
  const abc = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32: 16 chars = 80 bits
  const b = randomBytes(16);
  const s = [...b].map((x) => abc[x & 31]).join('');
  return 'MW-' + s.match(/.{4}/g).join('-');
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'release') {
  const [version, ...files] = args;
  if (!version || !files.length) throw new Error('usage: release <tag> <file.tar.gz>...');
  const password = randomBytes(24).toString('base64url'), out = {};
  for (const f of files) {
    const arch = /aarch64|arm64/i.test(f) ? 'aarch64' : 'x86_64';
    await encryptFile(f, f + '.enc', password);
    out[arch] = REPO + version + '/' + basename(f) + '.enc';
    console.log('Encrypted', f + '.enc', '-> attach it to release', version);
  }
  save(SECRET, { version, password, files: out });
  build();
} else if (cmd === 'add') {
  if (!args[0]) throw new Error('usage: add "<name>"');
  const keys = read(PRIVATE, []), key = newKey();
  keys.push({ key, name: args[0], added: new Date().toISOString().slice(0, 10) });
  save(PRIVATE, keys); build();
  console.log('\nKey for ' + args[0] + ': ' + key);
} else if (cmd === 'remove') {
  const keys = read(PRIVATE, []), left = keys.filter((t) => norm(t.key) !== norm(args[0] || ''));
  if (left.length === keys.length) throw new Error('Key not found.');
  save(PRIVATE, left); build();
} else if (cmd === 'list') {
  for (const t of read(PRIVATE, [])) console.log(t.key, ' ', t.added, ' ', t.name);
} else if (cmd !== 'lib') {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 7).join('\n'));
}
