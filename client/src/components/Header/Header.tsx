import React from "react";
import { isDebug } from "src/config";
import { Typography, Paper, Grid, Box, Button } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

function Header({
  title,
  subtitle,
  button,
  payload,
}: {
  title: React.ReactElement;
  subtitle?: React.ReactElement;
  button?: React.ReactElement;
  payload?: React.ReactElement;
}) {
  const theme = useTheme();
  const headerTopPadding = theme.spacing(2);
  const headerBotPadding = theme.spacing(4);

  return (
    <div className="UserHeader">
      <Paper
        elevation={0}
        style={{
          paddingTop: headerTopPadding,
          paddingBottom: headerBotPadding,
        }}
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={8}>
            <Grid item xs={12}>
              {title}
            </Grid>
            {payload && (
              <Grid item xs={12}>
                {payload}
              </Grid>
            )}
          </Grid>
          {button && (
            <Grid item xs={4}>
              {button}
            </Grid>
          )}
          {subtitle && (
            <Grid item xs={12}>
              {subtitle}
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  );
}

export default Header;
