import { useHttp } from '../hooks/useHttp';
import Loading from '../components/Loading';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
  TextField,
} from '@mui/material';
import { useState } from 'react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const UserList = () => {
  const [fetchSwitch, toggleFetchSwitch] = useState(true); // 手動請求資料
  const http = useHttp();

  const { data: users, isLoading: loadingUsers, mutate } = http.getSwr(
    fetchSwitch ? '/api/users?page=1' : null);
  const { data: resource, isLoading: loadingResource } = http.getSwr('/api/unknown/2');

  const { trigger: createUser, isMutating } = http.postSwr('/api/users');

  const handleCreateUser = async () => {
    await createUser({ first_name: 'Lucie', last_name: 'Wu', });

    // 新增資料 + 重取一次列表
    mutate((prev: User[] = []) => {
      const newUser: User = {
        id: 123321,
        email: 'email@example.com',
        first_name: '測試新增',
        last_name: '__測試新增',
        avatar: 'https://images.unsplash.com/photo-1745555926235-faa237ea89a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D',
      };
      return [newUser, ...prev];
    }, { revalidate: false });
  }

  console.log('resource', resource);

  if (fetchSwitch && loadingUsers) return <Loading />;
  if (loadingResource) return <Loading />;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
      👤使用者清單
      </Typography>


      <Box display="flex" gap={2} mb={4}>
        <Button onClick={() => toggleFetchSwitch(true)}>
          手動取清單
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateUser}
          disabled={isMutating}
        >
          {isMutating ? '新增中...' : '測試新增使用者'}
        </Button>
      </Box>

      {users && (
        <List>
          {users.map((user: User) => (
            <ListItem key={user.id}>
              <img src={user.avatar} alt={user.first_name} width={40} height={40} style={{ borderRadius: '50%', marginRight: 12 }} />
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      )}

      {resource && (
        <Box mb={4}>
          <Typography variant="subtitle1">🔎 Resource 資料</Typography>
          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <Typography>{resource.name}</Typography>
            <input type="color" value={resource.color}/>
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default UserList;
