// Chakra imports
import {
  Flex,
  Box,
  Icon,
  Select,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { useState } from 'react';
import LineChart from 'components/charts/LineChart';

// Custom components
import Card from 'components/card/Card';
import {
  lineChartDataOverallRevenue,
  lineChartOptionsOverallRevenue,
} from 'variables/charts';

// Assets
import { RiArrowUpSFill } from 'react-icons/ri';

export default function OverallRevenue(props: { [x: string]: any ,count:number}) {
  const { ...rest } = props;
  const theme = useTheme();
  //eslint-disable-next-line
  const [chartColor, setChartColor] = useState(theme.colors.brand[500]);

  const newOptions = {
    ...lineChartOptionsOverallRevenue,
    colors: [chartColor, '#39B8FF'],
  };

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Card
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      w="100%"
      mb={{ base: '20px', lg: '0px' }}
      {...rest}
    >
      <Flex justify="space-between" px={{base:'0px',sm:"20px"}} pt="5px" w="100%">
        <Flex align="center" w="100%">
          <Flex flexDirection="column" me="20px">
            <Text
              color={textColor}
              fontSize="34px"
              fontWeight="700"
              lineHeight="100%"
            >
              $37.5K
            </Text>
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
              mt="4px"
            >
              Overall Revenue
            </Text>
          </Flex>
          <Flex align="center">
            <Icon as={RiArrowUpSFill} color="green.500" me="2px" />
            <Text color="green.500" fontSize="sm" fontWeight="700">
              From {rest.count} Companies
            </Text>
          </Flex>
        </Flex>
        {/* <Select
          fontSize="sm"
          variant="subtle"
          defaultValue="monthly"
          width="unset"
          fontWeight="700"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select> */}
      </Flex>
      <Box minH="260px" mt="auto" w="100%">
        <LineChart
          chartData={lineChartDataOverallRevenue}
          chartOptions={newOptions}
        />
      </Box>
    </Card>
  );
}
