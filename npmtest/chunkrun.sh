  
NUM_Thread=32
for V in $(seq 1 $NUM_Thread);
do 
  #screen -S runscreen_$V -dm python callfunctionGenerator.py -c $V $NUM_Thread -t path_traversal
  screen -S runscreen_$V -dm python callfunctionGenerator.py -c $V $NUM_Thread -t os_command -l 120
  #screen -S runscreen_$V -dm python callfunctionGenerator.py -c $V $NUM_Thread -t code_exec -s -l 120
done
