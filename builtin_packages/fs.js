function read(a, b, c, d, e, f) {
  var ret = sink_hqbpillvul_fs_read(a,b,c,d,e);
  b();
  c();
  d();
  e();
  f();
  return ret;
}

module.exports = {
  read: read,
  readdir: read,
  readdirSync: read,
  readFile: read,
  readFileSync: read,
  readlink: read,
  readlinkSync: read,
  readSync: read
}
