import React, { useEffect, useState } from "react";
import { CartItem } from "src/interfaces";
import { PRICE_FRACTION_DIGITS } from "src/constants";
import { getSubtotalPrice } from "src/utils";
import { Typography, Paper, Grid, Divider } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";

function ItemCard({
  cartItem,
  showMedia = true,
  showEdit = false,
  selectActionCallback,
}: {
  cartItem: CartItem;
  showMedia?: boolean;
  showEdit?: boolean;
  selectActionCallback?: () => void;
}) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  return (
    <Paper
      elevation={0}
      style={{
        marginTop: themeSpacing,
        cursor: selectActionCallback ? "pointer" : "default",
      }}
      onClick={selectActionCallback}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        {showMedia && (
          <Grid item xs={3}>
            <p>Media</p>
          </Grid>
        )}
        <Grid item xs={3} container direction="row" alignItems="center">
          <Grid item>{showEdit && <EditIcon fontSize="small" />}</Grid>
          <Grid item>
            <Typography variant="body2">{cartItem.item.name}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2">
            ${cartItem.item.price.toFixed(PRICE_FRACTION_DIGITS)}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">
            ${getSubtotalPrice(cartItem)}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" align="center">
            {cartItem.quantity}
          </Typography>
        </Grid>
      </Grid>
      <Divider />
    </Paper>
  );
}

export default ItemCard;
