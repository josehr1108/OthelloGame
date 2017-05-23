dynamic disk/3.
dynamic possibleMovement/1.
dynamic boardSize/1.

disk(2,2,"black").
disk(2,3,"white").
disk(3,2,"white").
disk(3,3,"black").
disk(3,4,"black").
disk(2,5,"white").
disk(1,4,"black").
disk(1,2,"white").

noDisk(X,Y):-
   \+disk(X,Y,_).

getPossibleMovements(Color):-
   retractall(possibleMovement(X)),
   (Color = "black" ->
         disk(X,Y,"black"),
         write("Ficha"),write("("),write(X),write(","),write(Y),write("):"),
         inspectBottom(X,Y,"white"),
         inspectTop(X,Y,"white"),
         inspectLeft(X,Y,"white"),
         inspectRight(X,Y,"white"),
         inspectLeftTop(X,Y,"white"),
         inspectRightTop(X,Y,"white"),
         inspectLeftBottom(X,Y,"white"),
         inspectRightBottom(X,Y,"white")
    ;
    Color = "white" ->
         disk(X,Y,"white"),
         write("Ficha"),write("("),write(X),write(","),write(Y),write("):"),
         inspectBottom(X,Y,"black"),
         inspectTop(X,Y,"black"),
         inspectLeft(X,Y,"black"),
         inspectRight(X,Y,"black"),
         inspectLeftTop(X,Y,"black"),
         inspectRightTop(X,Y,"black"),
         inspectLeftBottom(X,Y,"black"),
         inspectRightBottom(X,Y,"black")
    ).

inspectBottom(X,Y,Color):-
   X2 is X+1,
   boardSize(Size),
   (X2 >= Size->
      !
   ;
   disk(X2,Y,Color)->  /*if*/
      X3 is X2+1,
      noDisk(X3,Y),
      write("Jugada:"),write("("),write(X3),write(","),write(Y),write(")"),
      assert(possibleMovement([X3,Y]))
   ),!.

inspectBottom(X,Y,Color):-
   X2 is X+1,
   boardSize(Size),
   (X2 >= Size->
      !
   ;
   disk(X2,Y,Color)->
      inspectBottom(X2,Y,Color)
   ;
      !
   ),!.

inspectTop(X,Y,Color):-
   X2 is X-1,
   (X2 =< 0->
      !
   ;
   disk(X2,Y,Color)->  /*if*/
      X3 is X2-1,
      noDisk(X3,Y),
      write("Jugada:"),write("("),write(X3),write(","),write(Y),write(")"),
      assert(possibleMovement([X3,Y]))
   ),!.

inspectTop(X,Y,Color):-
   X2 is X-1,
   (X2 =< 0->
      !
   ;
   disk(X2,Y,Color)->
      inspectTop(X2,Y,Color)
   ;
      !
   ),!.

inspectLeft(X,Y,Color):-
   Y2 is Y-1,
   (Y2 =< 0->
       !
   ;
   disk(X,Y2,Color)->  /*if*/
      Y3 is Y2-1,
      noDisk(X,Y3),
      write("Jugada:"),write("("),write(X),write(","),write(Y3),write(")"),
      assert(possibleMovement([X,Y3]))
   ),!.

inspectLeft(X,Y,Color):-
   Y2 is Y-1,
   (Y2 =< 0->
       !
   ;
   disk(X,Y2,Color)->
      inspectLeft(X,Y2,Color)
   ;
      !
   ),!.

inspectRight(X,Y,Color):-
   Y2 is Y+1,
   boardSize(Size),
   (Y2 >= Size->
      !
   ;
   disk(X,Y2,Color)->  /*if*/
      Y3 is Y2+1,
      noDisk(X,Y3),
      write("Jugada:"),write("("),write(X),write(","),write(Y3),write(")"),
      assert(possibleMovement([X,Y3]))
   ),!.

inspectRight(X,Y,Color):-
   Y2 is Y+1,
   boardSize(Size),
   (Y2 >= Size->
      !
   ;
   disk(X,Y2,Color)->
      inspectRight(X,Y2,Color)
   ;
      !
   ),!.

inspectLeftTop(X,Y,Color):-
   X2 is X-1,
   Y2 is Y-1,
   (X2 =< 0->
       !
   ;
   Y2 =< 0->
       !
   ;
   disk(X2,Y2,Color)->
        X3 is X2-1,
        Y3 is Y2-1,
        noDisk(X3,Y3),
        write("Jugada:"),write("("),write(X3),write(","),write(Y3),write(")"),
        assert(possibleMovement([X3,Y3]))
   ),!.

inspectLeftTop(X,Y,Color):-
   X2 is X-1,
   Y2 is Y-1,
   (X2 =< 0->
       !
   ;
   Y2 =< 0->
       !
   ;
   disk(X2,Y2,Color)->
       inspectLeftTop(X2,Y2,Color)
   ;
       !
   ),!.

inspectRightTop(X,Y,Color):-
   X2 is X-1,
   Y2 is Y+1,
   boardSize(Size),
   (X2 =< 0->
       !
   ;
   Y2 >= Size->
       !
   ;
   disk(X2,Y2,Color)->
        X3 is X2-1,
        Y3 is Y2+1,
        noDisk(X3,Y3),
        write("Jugada:"),write("("),write(X3),write(","),write(Y3),write(")"),
        assert(possibleMovement([X3,Y3]))
   ),!.

inspectRightTop(X,Y,Color):-
   X2 is X-1,
   Y2 is Y+1,
   boardSize(Size),
   (X2 =< 0->
       !
   ;
   Y2 >= Size->
       !
   ;
   disk(X2,Y2,Color)->
       inspectRightTop(X2,Y2,Color)
   ;
       !
   ),!.

inspectLeftBottom(X,Y,Color):-
   X2 is X+1,
   Y2 is Y-1,
   boardSize(Size),
   (X2 >= Size->
       !
   ;
   Y2 =< 0->
       !
   ;
   disk(X2,Y2,Color)->
        X3 is X2+1,
        Y3 is Y2-1,
        noDisk(X3,Y3),
        write("Jugada:"),write("("),write(X3),write(","),write(Y3),write(")"),
        assert(possibleMovement([X3,Y3]))
   ),!.

inspectLeftBottom(X,Y,Color):-
   X2 is X+1,
   Y2 is Y-1,
   boardSize(Size),
   (X2 >= Size->
       !
   ;
   Y2 =< 0->
       !
   ;
   disk(X2,Y2,Color)->
       inspectLeftBottom(X2,Y2,Color)
   ;
       !
   ),!.


inspectRightBottom(X,Y,Color):-
   X2 is X+1,
   Y2 is Y+1,
   boardSize(Size),
   (X2 >= Size->
       !
   ;
   Y2 >= Size->
       !
   ;
   disk(X2,Y2,Color)->
        X3 is X2+1,
        Y3 is Y2+1,
        noDisk(X3,Y3),
        write("Jugada:"),write("("),write(X3),write(","),write(Y3),write(")"),
        assert(possibleMovement([X3,Y3]))
   ),!.

inspectRightBottom(X,Y,Color):-
   X2 is X+1,
   Y2 is Y+1,
   boardSize(Size),
   (X2 >= Size->
       !
   ;
   Y2 >= Size->
       !
   ;
   disk(X2,Y2,Color)->
       inspectRightBottom(X2,Y2,Color)
   ;
       !
   ),!.
