const CustomTooltip = (props) => {
  console.log(props);
  return (
    <Tooltip
      title={props.title}
      interactive={true}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      leaveDelay={500}
    >
      {props.children}
    </Tooltip>
  );
};
