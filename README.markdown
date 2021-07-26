# Minimap-Game created using Javascript
Problem: Build a "mini map editor" using the provided images. When you click on the images on the left (the items: grass, dirt...) it should put it on the map on the right.

There is 2 layers possible
    Layer 1: Grass, Dirt, Road
    Layer 2: Bushes, Trees

User should be able to put grass for example and a Tree on top of that (2 layers).
Export the map in a file and import one.

User can select the width and height of his map by entering two numbers. If the new height or width his higher than the previous, new tiles are added on the right or bottom of the map. If the new height or width is lower than before, tiles disapear from the right and bottom.

User can click on a tile, the tile border light up and he can select the ground (layer 1: grass or dirt) and object (layer 2: brushes and trees). Only one thing can be selected by layer, if the user select something different the new choice replace the older one.


## Solution Overview
![Game Demo](https://s6.gifyu.com/images/minimap-game.gif)

## Lacking features
Need to implement the importing from JSON file


## Working solution hosted on CodePen
A Pen created on CodePen.io. Original URL: [https://codepen.io/earljohn004-the-looper/pen/qBqvMjV](https://codepen.io/earljohn004-the-looper/pen/qBqvMjV).


