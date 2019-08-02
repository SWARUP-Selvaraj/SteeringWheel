# SteeringWheel
A pluggable JavaScript Class for panning / zooming SVG using Group Transformation.

Inspired by **[panzoom.js](https://github.com/timmywil/panzoom)**, I started writing this script to eliminate the shortcomings of the former.

## Objective
This module has been written for the purpose of generating Machine Learning Datasets by annotating large / high resolution images.

## Requirements
This module requires the following:
1. ID of the target SVG (with a child : <g></g> group tag)
2. ID of the child group tag

## Functionality
### 1. Zoom
#### 1.1 Minimum Zoom Level
At the minimum zoom level, the image will fit within the svg element.

#### 1.2 Maximum Zoom Level
At the maximum zoom level, the image will be displayed at its original resolution.

#### 1.3 Intelligent Zoom Option
Having the zoom origin at top-left corner of the image is not intutive.

Even though it serves the purpose of zooming, the user does not know where the zoomed image will land.

Instead the Intelligent Zoom functionality zooms in to the image with the mouse position as the zoom origin.

The result is a *hybrid PanZoom*!

### 2. Pan
#### 2.1 Synchronous Panning
Irrespective of the zoom level, the image must move along with the mouse pointer while panning (without a lag or lead).

#### 2.2 Vanishing Image Problem
Instead of allowing infinite panning, limits have been enforced such that the entire image cannot move outside of the svg elements edge.

In other words, it has been made sure that there is always be some overlap between the viewBox and the image.

### 3. Modes
It features the following two modes:
#### 3.1 Steering Mode
In this mode, the user gets the pan functionality upon click and drag.

The zoom functionality will be available in both the modes.

#### 3.2 Annotation Mode
In annotation mode since click and drag will be used for drawing lines/rectangles, pan functionality will be unavailable.

However the user can use the intelligent zoom functionality (available through mouse wheel up/down) to quickly mimic pan.

### 4. Mode Switching
The mode can be changed by modifying the object's settings variable.

Alternatively, a modifier key like (alt / ctrl / capslock, etc.) can be specified in the settings variable to easily enable mode switching.

### 5. Visual Clues
Hand Grab mouse pointer appears whenever the user is in Steering mode.

While panning, the user gets a Hand Grabbing mouse pointer.

While zooming in/out, the user gets a +/- Magnifier cursor accordingly.

Crosshair pointer appears whenever the user is in annotation mode.



