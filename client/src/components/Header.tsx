import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <DashboardIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          OKR Summary Manager
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit">
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;