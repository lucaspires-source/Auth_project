import { AppBar, Toolbar, Typography, Button, IconButton, } from '@mui/material';
import { useAuth } from '../AuthContext';
import UserTable from './UserTable';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../ThemeContext';

function Dashboard() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {user ? `Hello ${user.first_name}` : 'User Management Dashboard'}
            </Typography>
            
            <IconButton onClick={toggleTheme} color="inherit">
            {theme === 'dark' ? <Brightness7Icon/> : <Brightness4Icon />}
            </IconButton>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
  
        <main style={{ padding: '20px' }}>
          <UserTable />
        </main>
      </div>
    );
  }
  
  export default Dashboard;