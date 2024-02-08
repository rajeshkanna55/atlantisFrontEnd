import { Box, Icon, Img, Text } from '@chakra-ui/react';
import React from 'react';
import ReplayBtn from 'assets/img/games/ReplayBtn.png';
import next from 'assets/img/screens/next.png';
interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

const ReplayGame: React.FC<{
  formData: any;
  imageSrc: any;
  replayGame: any;
  setCurrentScreenId: any;
}> = ({ formData, imageSrc, replayGame, setCurrentScreenId }) => {
  return (
    <>
      {imageSrc && (
        <>
          <Box className="thankyou-screen">
            <Box className="thankyou-screen-box">
              <Img src={imageSrc} className="bg-Img" />
            </Box>
            <Box
              w={'100%'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              position={'relative'}
            >
              <Box className="title" mt={'80px'}>
                <Text fontFamily={'AtlantisContent'} textAlign={'center'}>
                  Do You Want Play Again ?
                </Text>
              </Box>
              <Box
                // onClick={() => getData(data)}
                position={'fixed'}
                top={'360px'}
                w={'40%'}
                display={'flex'}
                justifyContent={'space-between'}
              >
                <Img
                  src={ReplayBtn}
                  w={'200px'}
                  h={'60px'}
                  cursor={'pointer'}
                  onClick={replayGame}
                />
                <Img
                  src={next}
                  w={'200px'}
                  h={'60px'}
                  cursor={'pointer'}
                  onClick={() =>
                    formData?.gameReflectionpageAllowed === 'true'
                      ? setCurrentScreenId(3)
                      : formData?.gameIsShowTakeaway === 'true'
                      ? setCurrentScreenId(7)
                      : setCurrentScreenId(6)
                  }
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default ReplayGame;
