 var svg;

 $(document).ready(function () {
     // Function reference, referencing the paiting tool currently selected
     // This is set to polyline by the end of the file, but we couldnt set it yet
     var toolCurrent;
     // Color to paint with
     var color = "black";
     // Reference to the marker object, that is used to preview objects before finished
     var current_marker = null;
     // undo for delete
     var deleted_marker = null;
     // Stores if the mouse is down or not
     var mouseisdown = false;
     // Startx and Starty, for drag paiting tools, such as rect
     var startx = 0; // used by varius tools such as rect
     var starty = 0;

     var currentState = '';
     //id for geometrics
     var gid = 0;
     //for copied
     var copiedItem;
     //
     //undo move
     var moveFlag = 0;
     var beforeMove = null;
     var afterMove = null;
     var movedItem = null;

     // The history of points, for tools such as polygon and penn	
     var points_history = "";
     // Reference to the svg object we paint on
     svg = document.getElementsByTagName('svg')[0]; //Get svg element

     //for group
     var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
     group.setAttribute("transform", 'translate(0,0)');
     svg.appendChild(group);

     //variables used for save 
     var SVGContent = null;

     //used to get time
     var date = new Date();
     var initialTime = date.getTime();
     //     console.log(initialTime);
     var newDate = null;
     var executionTime = null;

     $("#center").on("mousedown", function (event) {
         // Prevent unwanted drag and drop of svg objects
         return false;
     });

     /*
      * paint in the area(#center)
      */
     $("svg").on("mousedown", function (event) {
         //         console.log('shit');
         mouseisdown = true;
         //                console.log(event.target.transform);
         var offset = $("#center").offset(); //center is the canvas
         var x = event.pageX - offset.left;
         var y = event.pageY - offset.top;
         toolCurrent("mousedown", x, y, null);
         //                console.log(x, y);
     });

     $("svg").on("mouseup", function (event) {
         mouseisdown = false;
         var offset = $("#center").offset();
         var x = event.pageX - offset.left;
         var y = event.pageY - offset.top;
         toolCurrent("mouseup", x, y, null);
         //                console.log(x, y);
     });
     $("svg").on("mousemove", function (event) {
         var offset = $("#center").offset();
         var x = event.pageX - offset.left;
         var y = event.pageY - offset.top;
         toolCurrent("mousemove", x, y, null);
     });


     /*



     Button handler



     */
     // Event handler for circle tool
     $("#ellipse").on("mousedown", function () {
         toolCurrent("end_drawing");
         toolCurrent = tool_ellipse;
     });

     // Event handler for rect tool
     $("#rect").on("mousedown", function () {
         toolCurrent("end_drawing");
         toolCurrent = tool_rect;
     });

     // Event handler for pen tool
     $("#pen").on("mousedown", function () {
         toolCurrent("end_drawing");
         toolCurrent = tool_polyline;
     });

     // Event handler for polygon tool
     $("#polygon").on("mousedown", function () {
         toolCurrent("end_drawing");
         // Clears the points history
         points_history = "";
         toolCurrent = tool_polygon;
     });

     $('#line').on('mousedown', function () {
         toolCurrent("end_drawing");
         toolCurrent = tool_line;
     });

     $('#circle').on('mousedown', function () {
         toolCurrent("end_drawing");
         toolCurrent = tool_circle;
     });

     $('#square').on('mousedown', function () {
         toolCurrent("end_drawing");
         toolCurrent = tool_square;
     });

     /*


     process function


     */

     //   Description of the pen tool
     function tool_pen(action, x, y) {
         if (!mouseisdown) {
             return;
         }
         // http://stackoverflow.com/questions/16488884/add-svg-element-to-existing-svg-using-dom	
         var offset = $(this).offset();
         svg_circle(x, y, 5);
     }

     //tool for straight line
     function tool_line(action, x, y) {
         //console.log(action);
         switch (action) {
             case "mousedown":
                 //                 console.log(toolCurrent);
                 if (!mouseisdown) {
                     return;
                 }
                 startx = x;
                 starty = y;
                 break;
             case "mousemove":
                 if (!mouseisdown) {
                     return;
                 } else {
                     //                     console.log(toolCurrent);
                     $(current_marker).remove();
                     current_marker = svg_line(startx, starty, x, y);
                 }
                 break;
             case "mouseup":
                 newDate = new Date();
                 $(current_marker).remove();
                 svg_line(startx, starty, x, y);
                 executionTime = newDate.getTime();
                 console.log('line finished', (executionTime - initialTime) / 1000 + 's');
                 break;
         }
     }

     // Description of the rect tool
     function tool_rect(action, x, y) {
         var x1 = 0;
         var y1 = 0;
         var x2 = 0;
         var y2 = 0;
         if (startx < x) {
             x1 = startx;
             x2 = x;
         } else {
             x1 = x;
             x2 = startx;
         }

         if (starty < y) {
             y1 = starty;
             y2 = y;
         } else {
             y1 = y;
             y2 = starty;
         }
         var twidth = x2 - x1;
         var theight = y2 - y1;
         switch (action) {
             case "mousedown":
                 startx = x;
                 starty = y;
                 break;
             case "mousemove":
                 if (mouseisdown) {
                     $(current_marker).remove();
                     current_marker = svg_rect(x1, y1, twidth, theight);
                 }
                 break;
             case "mouseup":
                 newDate = new Date();
                 $(current_marker).remove();
                 svg_rect(x1, y1, twidth, theight);
                 executionTime = newDate.getTime();
                 console.log('rect finished', (executionTime - initialTime) / 1000 + 's');
                 break;
         }
     }

     //tool for square
     function tool_square(action, x, y) {
         var x1 = 0;
         var y1 = 0;
         var x2 = 0;
         var y2 = 0;
         if (startx < x) {
             x1 = startx;
             x2 = x;
         } else {
             x1 = x;
             x2 = startx;
         }

         if (starty < y) {
             y1 = starty;
             y2 = y;
         } else {
             y1 = y;
             y2 = starty;
         }
         var sideLength = x2 - x1;
         switch (action) {
             case "mousedown":
                 startx = x;
                 starty = y;
                 break;
             case "mousemove":
                 if (mouseisdown) {
                     $(current_marker).remove();
                     current_marker = svg_rect(x1, y1, sideLength, sideLength);
                 }
                 break;
             case "mouseup":
                 newDate = new Date();
                 $(current_marker).remove();
                 svg_rect(x1, y1, sideLength, sideLength);
                 executionTime = date.getTime();
                 console.log(executionTime, initialTime);
                 executionTime = newDate.getTime();
                 console.log('square finished', (executionTime - initialTime) / 1000 + 's');
                 break;
         }
     }

     // Description of the circle tool
     function tool_ellipse(action, x, y) {
         var x1 = 0;
         var y1 = 0;
         var x2 = 0;
         var y2 = 0;
         if (startx < x) {
             x1 = startx;
             x2 = x;
         } else {
             x1 = x;
             x2 = startx;
         }

         if (starty < y) {
             y1 = starty;
             y2 = y;
         } else {
             y1 = y;
             y2 = starty;
         }
         var twidth = x2 - x1;
         var theight = y2 - y1;

         switch (action) {
             case "mousedown":
                 startx = x;
                 starty = y;
                 break;
             case "mousemove":
                 if (mouseisdown) {
                     $(current_marker).remove();
                     current_marker = svg_ellipse((x1 + x2) / 2, (y1 + y2) / 2, twidth / 2, theight / 2);
                 }
                 break;
             case "mouseup":
                 newDate = new Date();
                 $(current_marker).remove();
                 svg_ellipse((x1 + x2) / 2, (y1 + y2) / 2, twidth / 2, theight / 2);
                 executionTime = newDate.getTime();
                 console.log('ellipse finished' + (executionTime - initialTime) / 1000 + 's');
                 break;

         }
     }

     function tool_circle(action, x, y) {
         var x1 = 0;
         var y1 = 0;
         var x2 = 0;
         var y2 = 0;
         if (startx < x) {
             x1 = startx;
             x2 = x;
         } else {
             x1 = x;
             x2 = startx;
         }

         if (starty < y) {
             y1 = starty;
             y2 = y;
         } else {
             y1 = y;
             y2 = starty;
         }
         var radius = (x2 - x1) / 2;
         var centerX = (x1 + x2) / 2;
         var centerY = (y1 + y2) / 2;

         switch (action) {
             case "mousedown":
                 startx = x;
                 starty = y;
                 break;
             case "mousemove":
                 if (mouseisdown) {
                     $(current_marker).remove();
                     current_marker = svg_ellipse(centerX, centerY, radius, radius);
                 }
                 break;
             case "mouseup":
                 newDate = new Date();
                 $(current_marker).remove();
                 svg_ellipse(centerX, centerY, radius, radius);
                 executionTime = date.getTime();
                 executionTime = newDate.getTime();
                 console.log('circle finished' + (executionTime - initialTime) / 1000 + 's');
                 break;

         }

     }

     // Description of the polyline tool (Pen tool)
     //free hand line
     function tool_polyline(action, x, y) {
         //console.log('pl line');
         //points_history="200,10 250,190 160,210";
         // console.log("polygon line " + action, " " + x + "  ,   " + y);
         switch (action) {
             case "end_drawing":
                 if (points_history != "") {
                     svg_polygon(points_history);
                 }
                 points_history = "";
                 break;
             case "mousemove":
                 if (mouseisdown) {
                     points_history += String(x) + "," + String(y) + " "
                     $(current_marker).remove();
                     //console.log(points_history);
                     current_marker = svg_polyline(points_history);
                 }
                 break;
             case "mouseup":
                 //points_history+=String(x)+","+String(y)+" "
                 newDate = new Date();
                 $(current_marker).remove();
                 svg_polyline(points_history);
                 points_history = "";
                 executionTime = newDate.getTime();
                 console.log('polyline finished' + (executionTime - initialTime) / 1000 + 's');
                 break;
         }
     }

     // Description of the polygon tool
     function tool_polygon(action, x, y) {
         switch (action) {
             case "end_drawing":
                 newDate = new Date();
                 if (points_history != "") {
                     svg_polygon(points_history);
                 }
                 points_history = "";
                 executionTime = newDate.getTime();
                 console.log('line finished', (executionTime - initialTime) / 1000 + 's');
                 break;
             case "mousedown":
                 points_history += String(x) + "," + String(y) + " "
                 $(current_marker).remove();
                 current_marker = svg_polygon(points_history);
                 break;
         }
     }


     /*


     Drawing 


     */

     // Drawing primitive for drawing svg rects
     function svg_rect(x, y, width, height) {
         var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
         newElement.setAttribute("class", "svgobject"); //Set path's data
         newElement.setAttribute("x", x); //Set path's data
         newElement.setAttribute("y", y); //Set path's data	
         newElement.setAttribute("width", width); //Set path's data
         newElement.setAttribute("height", height); //Set path's data
         newElement.setAttribute("fill", color);
         newElement.setAttribute("stroke", color);
         newElement.setAttribute("id", gid++);
         newElement.setAttribute("transform", 'translate(0,0)');
         svg.appendChild(newElement);
         return newElement;
     }

     // Drawing primitive for drawing svg ellipse
     function svg_ellipse(cx, cy, rx, ry) {
         var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse'); //Create a path in SVG's namespace
         newElement.setAttribute("class", "svgobject"); //Set path's data
         newElement.setAttribute("cx", cx); //Set path's data
         newElement.setAttribute("cy", cy); //Set path's data
         newElement.setAttribute("rx", rx); //Set path's data
         newElement.setAttribute("ry", ry); //Set path's data
         newElement.setAttribute("fill", color);
         newElement.setAttribute("stroke", color);
         newElement.setAttribute("id", gid++);
         newElement.setAttribute("transform", 'translate(0,0)');
         svg.appendChild(newElement);
         return newElement;
     }

     // Drawing primitive for drawing svg polygon
     function svg_polygon(points) {
         var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon'); //Create a path in SVG's namespace
         newElement.setAttribute("class", "svgobject"); //Set path's data	
         newElement.setAttribute("points", points); //Set path's data
         newElement.setAttribute("fill", color);
         newElement.setAttribute("stroke", color);
         newElement.setAttribute("id", gid++);
         newElement.setAttribute("transform", 'translate(0,0)');
         svg.appendChild(newElement);
         return newElement;
     }

     // Drawing primitive for drawing svg polyline
     function svg_polyline(points) {
         var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
         newElement.setAttribute("class", "svgobject"); //Set path's data	
         newElement.setAttribute("points", points); //Set path's data
         newElement.setAttribute("fill", 'none');
         newElement.setAttribute("stroke", color);
         newElement.setAttribute("stroke-width", "5");
         newElement.setAttribute("id", gid++);
         newElement.setAttribute("transform", 'translate(0,0)');
         svg.appendChild(newElement);
         return newElement;
     }

     function svg_line(startX, startY, endX, endY) {
         var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
         newElement.setAttribute("class", "svgobject");
         newElement.setAttribute("stroke", color);
         newElement.setAttribute("fill", 'none');
         newElement.setAttribute("stroke-width", "3");
         newElement.setAttribute("x1", startX);
         newElement.setAttribute("x2", endX);
         newElement.setAttribute("y1", startY);
         newElement.setAttribute("y2", endY);
         newElement.setAttribute("id", gid++);
         newElement.setAttribute("transform", 'translate(0,0)');
         svg.appendChild(newElement);
         return newElement;
     }
     /*

     End of geometric part

     */

     /*


     Tools part


     */

     // Description of how the eraser tool works
     $("#eraser").on("mousedown", function () {
         toolCurrent("end_drawing");
         console.log('enter the eraser');
         // This must be done here, to attach the event to all newly created svg objects
         //            $(".svgobject").on("mousemove", function (event) {
         //                toolCurrent("mousemove", 0, 0, $(this));
         //            });           
         $(".svgobject").on("mousedown", function (event) {
             toolCurrent("mousedown", 0, 0, $(this));
         });
         toolCurrent = tool_eraser;
     });

     // Definition of the eraser tool
     function tool_eraser(action, x, y, target) {
         if (target == undefined) {
             // Nothing clicked on
             return;
         }
         if (action == "mousedown") {
             deleted_marker = $(target);
             current_marker = null;
             $(target).remove();
         }
         if (action == "mousemove") {
             if (mouseisdown) {
                 deleted_marker = $(target);
                 current_marker = null;
                 $(target).remove();
             }
         }
     }


     $("#move").on('mousedown', function () {
         toolCurrent("end_drawing");

         console.log('enter the move');

         $(".svgobject").on("mousedown", function (event) {
             console.log(this);
             console.log($(this));
             //1
             this.classList.add('movedItem');
             // -1
             var offset = $("#center").offset();
             var x = event.pageX - offset.left;
             var y = event.pageY - offset.top;
             toolCurrent("mousedown", x, y, $(this), event.target);
             console.log(event.target);
             beforeMove = event.target.attributes["transform"].value;
             console.log(beforeMove);
         });

         $(".svgobject").on("mousemove", function (event) {
             var offset = $("#center").offset();
             var x = event.pageX - offset.left;
             var y = event.pageY - offset.top;
             toolCurrent("mousemove", x, y, $(this), event.target);
         });

         $(".svgobject").on("mouseup", function (event) {
             console.log(event.target);
             var offset = $("#center").offset();
             var x = event.pageX - offset.left;
             var y = event.pageY - offset.top;
             toolCurrent("mouseup", x, y, $(this), event.target);
             afterMove = event.target.attributes["transform"].value;
             this.classList.remove('movedItem');
             console.log(afterMove);
         });

         $(".movedItem").on("mousemove", function (event) {
             console.log('moving');
             var offset = $("#center").offset();
             var x = event.pageX - offset.left;
             var y = event.pageY - offset.top;
             toolCurrent("mousemove", x, y, $(this), event.target);
         });

         //         $(".movedItem").on("mouseup", function (event) {
         //             console.log(event.target);
         //             var offset = $("#center").offset();
         //             var x = event.pageX - offset.left;
         //             var y = event.pageY - offset.top;
         //             toolCurrent("mouseup", x, y, $(this), event.target);
         //             afterMove = event.target.attributes["transform"].value;
         //             this.classList.remove('movedItem');
         //             console.log(afterMove);
         //         });


         $("g.svggroup").on("mousedown", function (event) {
             var offset = $("#center").offset();
             var x = event.pageX - offset.left;
             var y = event.pageY - offset.top;
             this.classList.add('movedItem');
             toolCurrent("mousedown", x, y, $(this), $(this)[0]);
         });

         $("g.svggroup").on("mousemove", function (event) {
             var offset = $("#center").offset();
             var x = event.pageX - offset.left;
             var y = event.pageY - offset.top;
             toolCurrent("mousemove", x, y, $(this), $(this)[0]);
         });

         $("g.svggroup").on("mouseup", function (event) {
             var offset = $("#center").offset();
             var x = event.pageX - offset.left;
             var y = event.pageY - offset.top;

             //             console.log(this);
             toolCurrent("mouseup", x, y, $(this), $(this)[0]);
             this.classList.remove('movedItem');
         });

         toolCurrent = tool_move;

     });


     function tool_move(action, x, y, target, test) {
         if (test && test.id) {
             //console.log(test.id);
             if (document.getElementById(test.id - 1)) {
                 document.getElementById(test.id - 1).setAttribute('fill-opacity', 0)
                 document.getElementById(test.id - 1).setAttribute('stroke-opacity', 0);
             }
             //console.log(test);
             console.log(test.classList[1]);
         }



         if (target == undefined) {
             // Nothing clicked on
             return;
         }
         if (action == "mousedown" && test.classList[1] === "movedItem") {
             startx = x - test.transform.animVal["0"].matrix.e;
             starty = y - test.transform.animVal["0"].matrix.f;
         }

         if (action == "mousemove" && test.classList[1] === "movedItem") {
             if (!mouseisdown) {
                 return;
             } else {
                 if (test.transform.animVal["0"]) {
                     //                            console.log(test.transform.animVal["0"].matrix);
                     var transformX = x - startx;
                     var transformY = y - starty;
                     var transformAttr = 'translate(' + transformX + ',' + transformY + ')';
                     test.setAttribute('transform', transformAttr);
                 }
             }
         }

         if (action == "mouseup" && test.classList[1] === "movedItem") {
             var transformX = x - startx;
             var transformY = y - starty;
             //                console.log(x, y, startx, starty);
             var transformAttr = 'translate(' + transformX + ',' + transformY + ')';
             test.setAttribute('transform', transformAttr);
             moveFlag = 1;
             movedItem = test;
             newDate = new Date();
             executionTime = newDate.getTime();
             console.log('move finished', (executionTime - initialTime) / 1000 + 's');
         }

     }

     $('#copy').on('mousedown', function () {
         toolCurrent("end_drawing");
         console.log('enter the copy');
         $(".svgobject").on("click", function (event) {
             toolCurrent("click", 50, 50, $(this));
         });

         $("g").on("click", function (event) {
             toolCurrent("click", 50, 50, $(this));
         });

         toolCurrent = tool_copy;
     });

     $('#paste').on('mousedown', function () {
         toolCurrent("end_drawing");
         console.log('enter the paste');
         if (copiedItem) {
             copiedItem.setAttribute('transform', "translate(200, 200)");
             svg.appendChild(copiedItem);
             copiedItem = '';
         }
     });

     function tool_copy(action, x, y, target) {
         if (action === 'click') {
             copiedItem = target[0].cloneNode(true);
             console.log(copiedItem);
         }
     }


     $('#group').on('mousedown', function () {
         toolCurrent("end_drawing");
         console.log('enter the group');
         group.setAttribute('class', "svggroup");
         currentState = 'addGroup';
         $(".svgobject").on("click", function (event) {
             if (currentState === 'addGroup') {
                 event.preventDefault();
                 //console.log(event.target);
                 event.target.removeAttribute('class');
                 group.appendChild(event.target);
             }
         });
     });


     $('#ungroup').on('mousedown', function () {
         toolCurrent("end_drawing");
         console.log('enter the ungroup');
         console.log(group.childNodes.length);
         currentState = 'removeGroup';
         for (var i = 0; i <= group.childNodes.length; i++) {
             group.childNodes[i].setAttribute('class', 'svgobject');
             svg.appendChild(group.childNodes[i])
         }
         group.innerHTML = "";
         alert('the group has been separated');
     });


     var undoGroup = [];


     // Event handler for undo
     $("#undo").on("mousedown", function () {
         // Tips from 
         // http://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
         toolCurrent("end_drawing");

         console.log(beforeMove, moveFlag, movedItem);

         var undoItem = {};
         if (movedItem !== null && moveFlag && beforeMove !== null) {
             console.log(beforeMove, movedItem)
             movedItem.setAttribute('transform', beforeMove)
             moveFlag = 0;
             undoItem.category = 'move';
             undoItem.element = movedItem;
             movedItem = null;
             beforeMove = null;
         } else if (deleted_marker !== null) {
             svg.appendChild(deleted_marker[0]);
             undoItem.category = 'delete';
             undoItem.element = deleted_marker[0];
             deleted_marker = null;
         } else if (svg.lastChild) {
             undoItem.category = 'add';
             undoItem.element = svg.lastChild;
             svg.removeChild(svg.lastChild);
         }
         undoGroup.push(undoItem);
     });

     //event handler for redo
     $("#redo").on("mousedown", function () {

         toolCurrent("end_drawing");

         if (undoGroup) {
             var redoItem = undoGroup.pop()
             switch (redoItem.category) {
                 case 'move':
                     redoItem.element.setAttribute("transform", afterMove);
                 case 'add':
                     svg.appendChild(redoItem.element);
                     break;
                 case 'delete':
                     svg.removeChild(svg.lastChild);
                     break;
             }
         }
     });

     /*
            
     Load image
            
     */


     $('#file').on('change', function (file) {
         console.log('file');
         console.log(file);
         var imageFile = document.getElementById('file').files[0];
         if (imageFile) {
             var reader = new FileReader();
             reader.readAsText(imageFile, 'UTF-8');
             console.log(reader);
             reader.onload = function (e) {
                 console.log(e);
                 console.log(e.target.result.slice(70, -6));
                 console.log(svg);
                 svg.innerHTML = e.target.result.slice(70, -6);
             };
         }
         console.log(imageFile);
     });

     $('#save').on('mousedown', function () {
         SVGContent = document.getElementsByTagName('svg')[0].outerHTML;
         SVGContent = 'data:application/xml;charset=utf-8,  ' + SVGContent;
         var outputBtn = document.getElementById('output');
         outputBtn.setAttribute("href", SVGContent);

         //         a.setAttribute('download')
         console.log(SVGContent);
     });

     //change color

     $('#black').on('mousedown', function () {
         color = "#000"
     });

     $('#blue').on('mousedown', function () {
         console.log('shit');
         color = "#0275d8"
     });

     $('#grey').on('mousedown', function () {
         color = "#5a5b5c"
     });

     $('#green').on('mousedown', function () {
         color = "#5cb85c"
     });

     $('#sky').on('mousedown', function () {
         color = "#5bc0de"
     });

     $('#orange').on('mousedown', function () {
         color = "#f0ad4e"
     });

     $('#red').on('mousedown', function () {
         color = "#d9534f"
     });


     // Set the default tool
     toolCurrent = tool_ellipse;
 });
