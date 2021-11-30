function Document_element(id, class_name, tag){
    this.id = id;
    this.class_name = class_name;
    this.tag = tag;
}
Document_element.prototype.createElement = function(tagname){
    var de = new Document_element(undefined, undefined, tagname);
    return de;
}

function Document(){}

Document.prototype.createElement = Document_element.prototype.createElement;

document = new Document();

