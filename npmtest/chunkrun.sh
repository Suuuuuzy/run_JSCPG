NUM_Thread=30
for V in $(seq 1 $NUM_Thread);
do 
  screen -S runscreen_$V -dm python callfunctionGenerator.py -c $V $NUM_Thread -t path_traversal
done

