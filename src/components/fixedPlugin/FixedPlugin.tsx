// Chakra Imports
import { Button, Icon, Tooltip, useColorMode } from '@chakra-ui/react';
// Custom Icons
import { IoMdMoon, IoMdSunny } from 'react-icons/io';

export default function FixedPlugin(props: { [x: string]: any }) {
  const { ...rest } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  let bgButton = 'linear(to-b, brand.400, brand.600)';

  return (
    <Tooltip label={colorMode == 'dark' ? 'Light Theme' : 'Dark Theme'}>
    <Button
      {...rest}
      h="60px"
      w="60px"
      bgGradient={bgButton}
      zIndex="99"
      position="fixed"
      variant="no-effects"
      left={document.documentElement.dir === 'rtl' ? '35px' : ''}
      right={document.documentElement.dir === 'rtl' ? '' : '35px'}
      bottom="30px"
      borderRadius="50px"
      onClick={toggleColorMode}
      display="flex"
      p="0px"
      alignItems="center"
      justifyContent="center"
    >
      <Icon
        h="24px"
        w="24px"
        color="white"
        as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
      />
    </Button>
    </Tooltip>
  );
}
