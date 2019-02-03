const parentCenter = (parent, absMiddle) =>
  parent
    ? parent.center
    : {
        x: absMiddle,
        y: absMiddle,
      };

export default parentCenter;
