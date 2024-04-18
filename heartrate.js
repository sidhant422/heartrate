// Read heart rate data from heartrate.json
const heartRateData = require('./heartrate.json');

// Group data by date
const groupedData = new Map();
heartRateData.forEach((measurement) => {
  const date = measurement.timestamps.startTime.split('T')[0];
  if (!groupedData.has(date)) {
    groupedData.set(date, []);
  }
  groupedData.get(date).push(measurement);
});
//console.log(groupedData);
// Calculate statistics for each date
const output = [];
groupedData.forEach((measurements, date) => {
  const bpmValues = measurements.map((m) => m.beatsPerMinute);
  const minBpm = Math.min(...bpmValues);
  const maxBpm = Math.max(...bpmValues);
  const sortedBpm = bpmValues.sort((a, b) => a - b);
  const medianBpm = sortedBpm.length % 2 === 0
    ? (sortedBpm[sortedBpm.length / 2 - 1] + sortedBpm[sortedBpm.length / 2]) / 2
    : sortedBpm[Math.floor(sortedBpm.length / 2)];
  const latestDataTimestamp = measurements[measurements.length - 1].endTimestamp;

  output.push({
    date,
    min: minBpm,
    max: maxBpm,
    median: medianBpm,
    latestDataTimestamp,
  });
});

// Write output to output.json
const fs = require('fs');
fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

console.log('Statistics calculated and written to output.json.');
