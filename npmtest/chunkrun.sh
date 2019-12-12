NUM_Thread=40
for V in $(seq 1 $NUM_Thread);
do 
  screen -dm python callfunctionGenerator.py -c $V $NUM_Thread 
  # python callfunctionGenerator.py -c $V $NUM_Thread &
done

