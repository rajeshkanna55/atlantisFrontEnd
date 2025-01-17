// Chakra imports
import {
  Avatar,
  Flex,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
export default function Settings(props: {
  name: string;
  avatar: string;
  banner: string;
  data?: any;
}) {
  // eslint-disable-next-line
  const { name, avatar, banner,data } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  return (
    <Card mb="20px" alignItems="center">
      {/* <Image src={banner} borderRadius="16px" /> */}
      <Flex
        w="100%"
        bgGradient="linear(to-b, brand.400, brand.600)"
        minH={{base:'85px',sm:'85px',md:'95px',lg:"127px"}}
        borderRadius="16px"
      ></Flex>
      <Avatar mx="auto" bg={'#fff'} src={avatar} h="87px" w="87px" mt="-43px" mb="15px" />
      <Text fontSize="2xl" textColor={textColorPrimary} fontWeight="700">
        {data?.ctName}
      </Text>
      <Flex align="center" mx="auto" px="15px">
        <Text
          me="4px"
          color={textColorSecondary}
          fontSize="sm"
          fontWeight="400"
          lineHeight="100%"
        >
         {data?.ctMail}
        </Text>
        {/* <Select
          id="user_type"
          w="unset"
          variant="transparent"
          display="flex"
          textColor={textColorPrimary}
          color={textColorPrimary}
          alignItems="center"
          defaultValue="Administrator"
        >
          <option value="Administrator">Administrator</option>
          <option value="Member">Member</option>
        </Select> */}
      </Flex>
    </Card>
  );
}
