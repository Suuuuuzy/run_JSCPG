#
#
#set terminal pngcairo  transparent enhanced font "arial,10" fontscale 1.0 size 600, 400 
#set output 'errorbars.1.png'
set terminal postscript eps enhanced color font 'Helvetica,24'
set output 'runtimecdf.eps'
set style increment default
set style data lines
#set title "CDF graph for finished packages VS time"
set xlabel "Time [s]" 
#offset 0, 0.5, 0
set xrange [ * : * ] noreverse writeback
set x2range [ * : * ] noreverse writeback
set ylabel "Percentage of Finished Packages [%]" offset 1, 0, 0
set yrange [ 0 : 119 ] noreverse writeback
set y2range [ * : * ] noreverse writeback
set zrange [ * : * ] noreverse writeback
set cbrange [ * : * ] noreverse writeback
set rrange [ * : * ] noreverse writeback
set ytics 0, 10, 100
set grid
## Last datafile plotted: "battery.dat"
#plot [0:50] "runtimecdf.dat" u 1:2:3 t "Power" w xerr, n(x) t "Theory" w lines
#plot [0:19] "./run_time_cdf.dat" with filledcurve x1 title "Finished Percentage"
plot [0:30.0] "./run_time_cdf.dat" title "Multi-Execution" lw 6 lt 1, \
      [0:30.0] "./run_time_cdf_s.dat" title "Single-Execution" lw 6 lt 2 dashtype 3, \
#plot [0:20] "./run_time_cdf.dat" using 2 title 'CDF of Finished Percentage', \
#     [0:20] "./run_time_cdf.dat" using 3 title 'Distribution of Finished Percentage'

