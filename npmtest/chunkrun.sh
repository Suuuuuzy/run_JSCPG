NUM_Thread=20
for V in $(seq 1 $NUM_Thread);
do 
  screen -dm python callfunctionGenerator.py -s -c $V $NUM_Thread 
done

