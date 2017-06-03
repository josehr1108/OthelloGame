dynamic disk/3.
dynamic possibleMovement/4.
dynamic boardSize/1.
dynamic hasMoves/2.

noDisk(X,Y):-
   \+disk(X,Y,_).

placeDisks(BoardSize) :-
  Mid is div(BoardSize,2)-1,
  Next is Mid+1,
  assert(disk(Mid,Mid,"black")),
  assert(disk(Mid,Next,"white")),
  assert(disk(Next,Mid,"white")),
  assert(disk(Next,Next,"black")).

getPossibleMovements(Color):-
   (Color = "black" ->
         disk(X,Y,"black"),
         write("Ficha"),write("("),write(X),write(","),write(Y),write("):"),
         inspectBottom(X,Y,"white",X,Y),
         inspectTop(X,Y,"white",X,Y),
         inspectLeft(X,Y,"white",X,Y),
         inspectRight(X,Y,"white",X,Y),
         inspectLeftTop(X,Y,"white",X,Y),
         inspectRightTop(X,Y,"white",X,Y),
         inspectLeftBottom(X,Y,"white",X,Y),
         inspectRightBottom(X,Y,"white",X,Y)
   ;
   Color = "white" ->
         disk(X,Y,"white"),
         write("Ficha"),write("("),write(X),write(","),write(Y),write("):"),
         inspectBottom(X,Y,"black",X,Y),
         inspectTop(X,Y,"black",X,Y),
         inspectLeft(X,Y,"black",X,Y),
         inspectRight(X,Y,"black",X,Y),
         inspectLeftTop(X,Y,"black",X,Y),
         inspectRightTop(X,Y,"black",X,Y),
         inspectLeftBottom(X,Y,"black",X,Y),
         inspectRightBottom(X,Y,"black",X,Y)
   ).

inspectBottom(X,Y,Color,XCopy,YCopy):-
   X2 is X+1,
   boardSize(Size),
   (X2 >= Size-1->
      assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y,Color)->
      X3 is X2+1,
      noDisk(X3,Y),
      write("Jugada:"),write("("),write(X3),write(","),write(Y),write(")"),
      assert(possibleMovement([XCopy,YCopy],[X3,Y],Color,"bottom")),
      assert(hasMoves(Color,1))
   ),!.

inspectBottom(X,Y,Color,XCopy,YCopy):-
   X2 is X+1,
   boardSize(Size),
   (X2 >= Size-1->
      assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y,Color)->
      inspectBottom(X2,Y,Color,XCopy,YCopy)
   ;
      assert(hasMoves(Color,0)),!
   ),!.

inspectTop(X,Y,Color,XCopy,YCopy):-
   X2 is X-1,
   (X2 =< 0->
      assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y,Color)->
      X3 is X2-1,
      noDisk(X3,Y),
      write("Jugada:"),write("("),write(X3),write(","),write(Y),write(")"),
      assert(possibleMovement([XCopy,YCopy],[X3,Y],Color,"top")),
      assert(hasMoves(Color,1))
   ),!.

inspectTop(X,Y,Color,XCopy,YCopy):-
   X2 is X-1,
   (X2 =< 0->
      assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y,Color)->
      inspectTop(X2,Y,Color,XCopy,YCopy)
   ;
      assert(hasMoves(Color,0)),!
   ),!.

inspectLeft(X,Y,Color,XCopy,YCopy):-
   Y2 is Y-1,
   (Y2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   disk(X,Y2,Color)->
      Y3 is Y2-1,
      noDisk(X,Y3),
      write("Jugada:"),write("("),write(X),write(","),write(Y3),write(")"),
      assert(possibleMovement([XCopy,YCopy],[X,Y3],Color,"left")),
      assert(hasMoves(Color,1))
   ),!.

inspectLeft(X,Y,Color,XCopy,YCopy):-
   Y2 is Y-1,
   (Y2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   disk(X,Y2,Color)->
      inspectLeft(X,Y2,Color,XCopy,YCopy)
   ;
      assert(hasMoves(Color,0)),!
   ),!.

inspectRight(X,Y,Color,XCopy,YCopy):-
   Y2 is Y+1,
   boardSize(Size),
   (Y2 >= Size-1->
      assert(hasMoves(Color,0)),!
   ;
   disk(X,Y2,Color)->
      Y3 is Y2+1,
      noDisk(X,Y3),
      write("Jugada:"),write("("),write(X),write(","),write(Y3),write(")"),
      assert(possibleMovement([XCopy,YCopy],[X,Y3],Color,"right")),
      assert(hasMoves(Color,1))
   ),!.

inspectRight(X,Y,Color,XCopy,YCopy):-
   Y2 is Y+1,
   boardSize(Size),
   (Y2 >= Size-1->
      assert(hasMoves(Color,0)),!
   ;
   disk(X,Y2,Color)->
      inspectRight(X,Y2,Color,XCopy,YCopy)
   ;
      assert(hasMoves(Color,0)),!
   ),!.

inspectLeftTop(X,Y,Color,XCopy,YCopy):-
   X2 is X-1,
   Y2 is Y-1,
   (X2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   Y2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y2,Color)->
        X3 is X2-1,
        Y3 is Y2-1,
        noDisk(X3,Y3),
        write("Jugada:"),write("("),write(X3),write(","),write(Y3),write(")"),
        assert(possibleMovement([XCopy,YCopy],[X3,Y3],Color,"leftTop")),
        assert(hasMoves(Color,1))
   ),!.

inspectLeftTop(X,Y,Color,XCopy,YCopy):-
   X2 is X-1,
   Y2 is Y-1,
   (X2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   Y2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y2,Color)->
       inspectLeftTop(X2,Y2,Color,XCopy,YCopy)
   ;
       assert(hasMoves(Color,0)),!
   ),!.

inspectRightTop(X,Y,Color,XCopy,YCopy):-
   X2 is X-1,
   Y2 is Y+1,
   boardSize(Size),
   (X2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   Y2 >= Size-1->
       assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y2,Color)->
        X3 is X2-1,
        Y3 is Y2+1,
        noDisk(X3,Y3),
        write("Jugada:"),write("("),write(X3),write(","),write(Y3),write(")"),
        assert(possibleMovement([XCopy,YCopy],[X3,Y3],Color,"rightTop")),
        assert(hasMoves(Color,1))
   ),!.

inspectRightTop(X,Y,Color,XCopy,YCopy):-
   X2 is X-1,
   Y2 is Y+1,
   boardSize(Size),
   (X2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   Y2 >= Size-1->
       assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y2,Color)->
       inspectRightTop(X2,Y2,Color,XCopy,YCopy)
   ;
       assert(hasMoves(Color,0)),!
   ),!.

inspectLeftBottom(X,Y,Color,XCopy,YCopy):-
   X2 is X+1,
   Y2 is Y-1,
   boardSize(Size),
   (X2 >= Size-1->
       assert(hasMoves(Color,0)),!
   ;
   Y2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y2,Color)->
        X3 is X2+1,
        Y3 is Y2-1,
        noDisk(X3,Y3),
        write("Jugada:"),write("("),write(X3),write(","),write(Y3),write(")"),
        assert(possibleMovement([XCopy,YCopy],[X3,Y3],Color,"leftBottom")),
        assert(hasMoves(Color,1))
   ),!.

inspectLeftBottom(X,Y,Color,XCopy,YCopy):-
   X2 is X+1,
   Y2 is Y-1,
   boardSize(Size),
   (X2 >= Size-1->
       assert(hasMoves(Color,0)),!
   ;
   Y2 =< 0->
       assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y2,Color)->
       inspectLeftBottom(X2,Y2,Color,XCopy,YCopy)
   ;
       assert(hasMoves(Color,0)),!
   ),!.


inspectRightBottom(X,Y,Color,XCopy,YCopy):-
   X2 is X+1,
   Y2 is Y+1,
   boardSize(Size),
   (X2 >= Size-1->
       assert(hasMoves(Color,0)),!
   ;
   Y2 >= Size-1->
       assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y2,Color)->
        X3 is X2+1,
        Y3 is Y2+1,
        noDisk(X3,Y3),
        write("Jugada:"),write("("),write(X3),write(","),write(Y3),write(")"),
        assert(possibleMovement([XCopy,YCopy],[X3,Y3],Color,"rightBottom")),
        assert(hasMoves(Color,1))
   ),!.

inspectRightBottom(X,Y,Color,XCopy,YCopy):-
   X2 is X+1,
   Y2 is Y+1,
   boardSize(Size),
   (X2 >= Size-1->
       assert(hasMoves(Color,0)),!
   ;
   Y2 >= Size-1->
       assert(hasMoves(Color,0)),!
   ;
   disk(X2,Y2,Color)->
       inspectRightBottom(X2,Y2,Color,XCopy,YCopy)
   ;
       assert(hasMoves(Color,0)),!
   ),!.





