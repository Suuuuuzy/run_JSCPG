NUM_Thread=32
for V in $(seq 1 $NUM_Thread);
do 
  screen -S runscreen_$V -dm python callfunctionGenerator.py -c $V $NUM_Thread -t proto_pollution -s -l 300
done
