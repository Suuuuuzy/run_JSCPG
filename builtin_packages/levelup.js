function Levelup(input_path) {
  this.put = function(things) {
    var db_inside = things;
    sink_hqbpillvul_db(db_inside);
  }
}

function levelup(input_path) {
  return new Levelup(input_path);
}

module.exports = levelup;
