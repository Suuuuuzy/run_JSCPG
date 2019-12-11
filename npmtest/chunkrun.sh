NUM_Thread=30
for V in $(seq 1 $NUM_Thread);
do 
  # screen -d -m python callfunctionGenerator.py -c $V $NUM_Thread 
  python callfunctionGenerator.py -c $V $NUM_Thread &
done

