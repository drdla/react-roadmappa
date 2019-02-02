/*
 * Get the maximum value of plannedForInterval from the roadmap data.
 *
 * @return  {Number}    Value of maximum interval
 */

const getMaximumInterval = roadmap => {
  const intervals = [];

  roadmap.forEach(e => {
    e.features.forEach(e => {
      intervals.push(e.plannedForInterval);
    });
  });

  return Math.max(...intervals);
};

export default getMaximumInterval;
