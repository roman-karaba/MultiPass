const courseCardStyle = theme => ({
  card: {
    border: "0",
    marginBottom: "8px",
    marginTop: "8px",
    borderRadius: "6px",
    color: "rgba(0, 0, 0, 0.87)",
    background: "#fff",
    width: "100%",
    boxShadow:
      "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minWidth: "0",
    wordWrap: "break-word",
    fontSize: ".875rem",
    transition: "all 300ms linear",
  },
  cardPlain: {
    background: "transparent",
    boxShadow: "none"
  },
  cardCarousel: {
    overflow: "hidden"
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
    padding: "0px",
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  cardContent:{
    padding: "5px"
  },
  expandButtom: {
    padding: "0px"
  },
  summaryContainer: {
    padding: "5px 0px 5px"
  },
  butsize:{
    height: "25px",
    width: "25px"
  },
  column:{
    padding:"5px",
    borderLeft: "1px solid rgb(220, 220, 220)",
    borderRight: "1px solid rgb(220, 220, 220)"
  }
});

export default courseCardStyle;