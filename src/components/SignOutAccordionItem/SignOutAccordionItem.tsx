import { Accordion, Avatar, Box, Grid, Group, Text, useMantineTheme } from '@mantine/core';
import useFirebase from '../../providers/useFirebase';
import SignOut from '../SignOut/SignOut';

export default function SignOutUserAccordionItem() {
  const theme = useMantineTheme();
  const { user } = useFirebase();

  return (
    <Box
      sx={{
        borderTop: `1px solid ${theme.colors.dark[4]}`,
      }}>
      <Accordion iconPosition="right">
        <Accordion.Item
          sx={{ flex: 1 }}
          label={
            <Group>
              <Avatar src={user?.photoURL ?? ''} radius="xl" />
              <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {user?.displayName ?? ''}
                </Text>
                <Text color="dimmed" size="xs">
                  {user?.email ?? ''}
                </Text>
              </Box>
            </Group>
          }>
          <Grid sx={{ justifyContent: 'center' }}>
            <SignOut />
          </Grid>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
}
