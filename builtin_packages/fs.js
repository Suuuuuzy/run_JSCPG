function read(a, b, c, d, e, f) {
  var ret = sink_hqbpillvul_fs_read(a,b,c,d,e);
  b();
  c();
  d();
  e();
  f();
  return ret;
}

function readFile(pathname, cb) {
  // just build a link from pathname to cb
  // mark the path used read
  var ret = sink_hqbpillvul_fs_read(pathname);
  cb(ret == '123', ret);
}

module.exports = {
  read: read,
  readdir: read,
  readdirSync: read,
  readFile: readFile,
  readFileSync: readFile,
  readlink: read,
  readlinkSync: read,
  readSync: read
}
