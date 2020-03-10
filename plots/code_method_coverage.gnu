#
#
#set terminal pngcairo  transparent enhanced font "arial,10" fontscale 1.0 size 600, 400 
#set output 'coveragedis.png'
set terminal postscript eps enhanced color font 'Helvetica,24'
set style increment default
set style data lines
set grid
#set title "CDF graph for finished packages VS time"
set xlabel "Coverage [%]"
# offset 0, 0.5, 0
set xrange [ * : * ] noreverse writeback
set x2range [ * : * ] noreverse writeback
set ylabel "Percentage of Packages [%]" offset 1, 0, 0
set y2range [ * : * ] noreverse writeback
set zrange [ * : * ] noreverse writeback
set cbrange [ * : * ] noreverse writeback
set rrange [ * : * ] noreverse writeback
## Last datafile plotted: "battery.dat"
#plot [0:50] "runtimecdf.dat" u 1:2:3 t "Power" w xerr, n(x) t "Theory" w lines
#plot [0:19] "./run_time_cdf.dat" with filledcurve x1 title "Finished Percentage"
#
#for cdf
set yrange [ 0 : 110 ] noreverse writeback
set output 'coveragecdf.eps'
plot [0:100] "./coverage_cdf.dat" using 1:2 every 5 title "Statement" lw 6 lt 1 smooth csplines, \
            "./coverage_cdf.dat" using 1:3 every 5 title "Function" lw 6 lt 2 dashtype 3 smooth csplines
#
# for dis
set output 'coveragedis.eps'
set yrange [ 0 : 50 ] noreverse writeback
plot [0:100] "./coverage_dis.dat" using 1:2 every 2 title "Statement" lw 6 lt -1 lc 'purple', \
            "./coverage_dis.dat" using 1:3 every 2 title "Function" lw 6 lt 2 dashtype 3

#for bar
#set terminal pngcairo  transparent enhanced font "arial,10" fontscale 1.0 size 600, 400 
#set output 'coveragebar.png'
set style data histograms 
set output 'coveragebar.eps'
set xtics rotate by 45 right
set yrange [ 0 : 60 ] noreverse writeback
set style histogram clustered gap 1 title textcolor lt -1
plot [0:] "./coverage_bar.dat" using 2:xtic(1) title "Statement" fill solid lc "purple" lt -1, "" using 3 title "Function" fs pattern 2 
#smooth csplines
# smooth csplines, \

