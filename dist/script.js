/* Constant variables */
const VALUE_GRASS = 'g';
const VALUE_SAND = 's';
const VALUE_BARREL = 'b';
const VALUE_TREE = 't';
const VALUE_NONE = 'x';

const SPLIT_CHAR = '_';

const INDEX_ROW = 0;
const INDEX_COLUMN = 1;

/* Main minimap object */
var minimap_ = {
  layer_1:[],
  layer_2:[],
  length:0,
  width:0,
};

// Map contains the image thumbnails  to be used in minimap
let images_map = new Map();
images_map.set(VALUE_GRASS, {image_source:'<image src="https://i.postimg.cc/3R4NkRSZ/grass.png"'});
images_map.set(VALUE_SAND, {image_source:'<image src="https://i.postimg.cc/C131kg9p/sand.png"'});
images_map.set(VALUE_BARREL, {image_source:'<image src="https://i.postimg.cc/cJ561YmH/barrel.png"'});
images_map.set(VALUE_TREE, {image_source:'<image src="https://i.postimg.cc/4yp310T7/tree.png"'});


// Generate minimap buton click action
btn_generate.onclick = function(){
  minimap_.length = document.getElementById("input_length").value;
  minimap_.width = document.getElementById("input_width").value;
  generateMiniMap( minimap_.width, minimap_.length );
  $('#btn_generate').hide();
  $('#btn_modify').removeAttr('disabled');
  $('#btn_exportJSON').removeAttr('disabled');
}

// modify size of minimap buton click action
btn_modify.onclick = function(){
  var new_length = document.getElementById("input_length").value;
  var new_width = document.getElementById("input_width").value;
  
  // Checking of new length
  if( parseInt(new_length) >= parseInt(minimap_.length)){
    minimapAddRow( parseInt(new_length), parseInt(new_width));
  }else {
    minimapEraseRow(parseInt(new_length));
  }
  minimap_.length=new_length;
  
  // Checking of new width
  if( parseInt(new_width) >= parseInt(minimap_.width)){
    minimapAddColumn( new_length, new_width );
  }else {
    minimapEraseColumn(new_length, new_width);
  }
  minimap_.width=new_width;
  
  //Draw layer 1 
  drawMiniMapLayer1();
  //Draw layer 2 
  drawMinimapLayer2();
}

btn_exportJSON.onclick = function(){

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(minimap_, null, 2)], {
    type: "text/plain"
  }));
  a.setAttribute("download", "data.json");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

}


img_barrel.onclick = function(){
  var index = $('.highlight_image').attr('id');
  
  if(index === undefined ){
    alert('Please select a location on the minimap')
  }else{
    var split_index = index.split(SPLIT_CHAR);
    var tmp = minimap_.layer_2[split_index[INDEX_ROW]];
    minimap_.layer_2[split_index[INDEX_ROW]] = replaceAt(tmp, parseInt(split_index[INDEX_COLUMN]), VALUE_BARREL);
    drawMinimapLayer2();
    
    $('.highlight_image').removeClass('highlight_image'); 
  }
}

img_grass.onclick = function(){
  var index = $('.highlight_image').attr('id');
  
  if(index === undefined ){
    alert('Please select a location on the minimap')
  }else{
    var split_index = index.split(SPLIT_CHAR);
    var tmp = minimap_.layer_1[split_index[INDEX_ROW]];
    minimap_.layer_1[split_index[INDEX_ROW]] = replaceAt(tmp, parseInt(split_index[INDEX_COLUMN]), VALUE_GRASS);
    //Draw layer 1 
    drawMiniMapLayer1();
    drawMinimapLayer2();

    $('.highlight_image').removeClass('highlight_image'); 
  }
}

img_sand.onclick = function(){
  var index = $('.highlight_image').attr('id');
  
  if(index === undefined){
    alert('Please select a location on the minimap')
  }else{
    var split_index = index.split(SPLIT_CHAR);
    var tmp = minimap_.layer_1[split_index[INDEX_ROW]];
    minimap_.layer_1[split_index[INDEX_ROW]] = replaceAt(tmp, parseInt(split_index[INDEX_COLUMN]), VALUE_SAND);
    drawMiniMapLayer1();
    drawMinimapLayer2();

    $('.highlight_image').removeClass('highlight_image'); 
  }
}

img_tree.onclick = function(){
  var index = $('.highlight_image').attr('id');
  
  if(index === undefined ){
    alert('Please select a location on the minimap')
  }else{
    var split_index = index.split(SPLIT_CHAR);
    var tmp = minimap_.layer_2[split_index[INDEX_ROW]];
    minimap_.layer_2[split_index[INDEX_ROW]] = replaceAt(tmp, parseInt(split_index[INDEX_COLUMN]), VALUE_TREE);
    drawMinimapLayer2();
    
    $('.highlight_image').removeClass('highlight_image'); 
  }
}

// Add red box to the dynamically added image
$('#id_placeholder').on('click', 'img', function () {
  $('.highlight_image').removeClass('highlight_image');
  $(this).addClass('highlight_image');
});

// Resize minimap by removing columns from the right
function minimapEraseColumn( new_length, new_width ){
  for(var i=0; i<new_length; i++){
   minimap_.layer_1[i] =  minimap_.layer_1[i].substr(0,new_width);
   minimap_.layer_2[i] =  minimap_.layer_2[i].substr(0,new_width);
  }
}

// Resize minimap by adding columns to the right
function minimapAddColumn( new_length, new_width ){
  for(var i=0; i<new_length; i++){
    var initial_text ='';
    minimap_.layer_1[i]+=initial_text.padEnd(new_width - minimap_.width ,VALUE_GRASS);
    minimap_.layer_2[i]+=initial_text.padEnd(new_width - minimap_.width ,VALUE_NONE);
  }
}

// Resize minimap by removing row from the last row
function minimapEraseRow( new_length ){
  for(var i=0; i<(minimap_.length)-new_length; i++){
    minimap_.layer_1.length--;
    minimap_.layer_2.length--;
  }
  deleteAllRows();
}

// Resize minimap by adding rows to the bottom
function minimapAddRow(new_length, new_width ){
  for(var i=0; i<(new_length-minimap_.length); i++){
    var initial_text ='';
    
    minimap_.layer_1.push(initial_text.padEnd(new_width,VALUE_GRASS));
    minimap_.layer_2.push(initial_text.padEnd(new_width,VALUE_NONE));
  }
}

// Initial creation of minimap
function generateMiniMap(width, height){
  for(var h=0; h<height; h++){
    var layer1_value="";
    var layer2_value="";
    for(var w=0; w<width; w++){
      
      layer1_value+=VALUE_GRASS; //layer1 is initialized into grass
      layer2_value+=VALUE_NONE; //layer2 is initialized to nothing
    }
    minimap_.layer_1.push(layer1_value);
    minimap_.layer_2.push(layer2_value);
  }
  //Draw the map on the canvas
  drawMiniMapLayer1();
}

function deleteAllRows(){
  for(var index=0; index<minimap_.length; index++){
    var delete_row = "#id_row"+index;
    $(delete_row).remove();
  }
}

function drawMiniMapLayer1(){
  
  for(var index=0; index<minimap_.length; index++){
    
    var delete_row = "#id_row"+index;
    $(delete_row).remove();
    
    $('<div class="row" id="id_row'+ index + '">'+
      '<div class="col-md-12 no-padding bg-warning">'+
      iterateImages(index) //Generate list of images from minimap_ object
      ).appendTo("#id_placeholder");
  }
}

function drawMinimapLayer2(){
  for(var l=0; l<minimap_.length; l++){
    for(var w=0; w<minimap_.width; w++){
      if(minimap_.layer_2[l].charAt(w)!='x'){
        
        var generate_id = l+SPLIT_CHAR+w+SPLIT_CHAR+'0';
        var string = minimap_.layer_2[l].charAt(w);
        var img_string=images_map.get(string).image_source+' class="overlap-image" id="'+generate_id+'"/>';
        var location_id = '#'+l+SPLIT_CHAR+w;
        
        $('#'+generate_id).remove();
        //Append Image to location
        $(img_string).insertBefore(location_id);
        
      }else{ /*Do nothing*/ }
    }
  }
}

// Iterate the number of images to be displayed
function iterateImages(row){
  var tmp="";
  var string="";
  var char="";
  for(var i=0; i<minimap_.width; i++){
    string = minimap_.layer_1[row].charAt(i);
    tmp+=images_map.get(string).image_source+"id="+row+SPLIT_CHAR+i+'>';
  }
  return tmp;
}

// Replace character at specified index on string
function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}