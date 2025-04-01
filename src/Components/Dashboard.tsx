import { AppBar, Toolbar, Typography, Button,  } from '@mui/material';
import { useAuth } from '../AuthContext';
import UserTable from './UserTable';


function Dashboard() {
    const { user, logout } = useAuth();
  
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {user ? `Hello ${user.first_name}` : 'User Management Dashboard'}
            </Typography>
            
            
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