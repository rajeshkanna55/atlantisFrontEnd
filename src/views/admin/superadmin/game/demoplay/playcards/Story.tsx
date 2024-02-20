// Chakra Imports
import { Box, Flex, Img, Text, useToast } from '@chakra-ui/react';

import bk from 'assets/img/games/17.png';
import note from 'assets/img/games/note.png';
import next from 'assets/img/screens/next.png';
import dial from 'assets/img/games/Dialogue.png';
import char from 'assets/img/games/charbox.png';
import right from 'assets/img/games/right.png';
import left from 'assets/img/games/left.png';
import parch from 'assets/img/games/parch.png';
import on from 'assets/img/games/on.png';
import off from 'assets/img/games/off.png';
import React, {
  Suspense,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { Canvas, useLoader, useFrame } from 'react-three-fiber';

import feedi from 'assets/img/screens/feed.png';
import TypingEffect from './Typing';
import { getVoiceMessage, getPreview } from 'utils/game/gameService';
import { useParams } from 'react-router-dom';
// Import ProfileContext from EntirePreview
import { ProfileContext } from '../EntirePreview';
import { motion } from 'framer-motion';
import { API_SERVER } from 'config/constant';
import { ScoreContext } from '../GamePreview';

const Story: React.FC<{
  currentScore: any;
  data: any;
  type: any;
  backGroundImg: any;
  getData: any;
  option: any;
  options: any;
  handleValidate: any;
  resMsg: any;
  feed: any;
  formData: any;
  setAudio: any;
  setCurrentScreenId: any;
  selectedPlayer: any;
  selectedNpc: any;
  getAudioForText: any;
  voiceIds: any;
}> = ({
  data,
  type,
  resMsg,
  feed,
  getData,
  option,
  options,
  handleValidate,
  backGroundImg,
  formData,
  setCurrentScreenId,
  setAudio,
  selectedPlayer,
  selectedNpc,
  getAudioForText,
  voiceIds,
  currentScore,
}) => {
  const [showNote, setShowNote] = useState(true),
    [first, setFirst] = useState(false);

  const userProfile = useContext(ProfileContext);
  const { profile, setProfile } = useContext(ScoreContext);
  const [score, setScore] = useState(null);
  useEffect(() => {
    getVoice(data, type);
    setShowNote(true);
    setTimeout(() => {
      setShowNote(false);
    }, 1000);
  }, [data, type]);

  useEffect(() => {
    setShowNote(true);
    setFirst(true);
    setTimeout(() => {
      setFirst(false);
      setShowNote(false);
    }, 1000);
  }, []);

  const getVoice = async (blockInfo: any, blockType: string) => {
    let text = '';
    let voiceId = '';
    /** 
         * For voice 
        data.includes('note') =>  Game Narattor
        data.includes('dialog') =>  data.character
        data.includes('interaction') => data.blockRoll
        resMsg => data.blockRoll
        
        *For Animations & Emotion & voice Modulation 
        data.includes('dialog') => data.animation
        data.includes('interaction') //For Question => data.QuestionsEmotion
        data.includes('interaction') //For Answers  => optionsObject[] : data.optionsemotionObject[]
          resMsg =>responseObject[]  : responseemotionObject[]
        */

    switch (blockType) {
      case 'Note':
        text = blockInfo.blockText;
        voiceId = voiceIds?.narrator;
        break;
      case 'Dialog':
        text = blockInfo.blockText;
        voiceId =
          blockInfo?.blockRoll == '999999'
            ? voiceIds.NPC
            : userProfile?.gender == 'Male'
            ? voiceIds?.playerMale
            : voiceIds?.playerFemale;
        break;
      case 'Interaction':
        let optionsText = '';
        console.log('options', options);
        options.forEach((item: any) => {
          optionsText +=
            '---Option ' + item?.qpOptions + '-' + item?.qpOptionText;
        });
        text = blockInfo.blockText + optionsText;
        console.log(
          "userProfile?.gender == 'Male'",
          userProfile?.gender == 'Male',
        );
        console.log('blockInfo?.blockRoll ', blockInfo?.blockRoll);
        voiceId =
          blockInfo?.blockRoll == '999999'
            ? voiceIds.NPC
            : userProfile?.gender == 'Male'
            ? voiceIds?.playerMale
            : voiceIds?.playerFemale;
        break;
      case 'Response':
        text = resMsg;
        voiceId =
          blockInfo?.blockRoll == '999999'
            ? voiceIds.NPC
            : userProfile?.gender === 'Male'
            ? voiceIds?.playerMale
            : voiceIds?.playerFemale;
        break;
      case 'Feedback':
        text = feed;
        voiceId =
          blockInfo?.blockRoll == '999999'
            ? voiceIds.NPC
            : userProfile?.gender === 'Male'
            ? voiceIds?.playerMale
            : voiceIds?.playerFemale;
        break;
    }
    getAudioForText(text, voiceId);
  };

  const InteractionFunction = () => {
    setProfile((prev: any) => ({...prev,
      score:prev.score + score,
    }));
    getData(data);
  };
  const optionClick = (item: any, ind: any) => {
    setScore(parseInt(item?.qpScore));
    handleValidate(item, ind);
  };
  console.log(profile);
  return (
    <>
      {data && type === 'Note' && (
        <Box
          w={'100%'}
          h={'100vh'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          position={'relative'}
          overflow={'visible'}
          style={{ perspective: '1000px' }}
        >
          <Box
            color={'rgba(0, 0, 0, 0.5)'}
            backgroundImage={backGroundImg}
            w={'100%'}
            h={'100vh'}
            backgroundRepeat={'no-repeat'}
            backgroundSize={'cover'}
            transform={`scale(${first ? 1 : 1.3}) translateY(${
              first ? 0 : -10
            }%) translateX(${first ? 0 : -10}%)`}
            transition={'transform 0.9s ease-in-out'}
          >
            <Box
              position={'fixed'}
              top={'200px'}
              // left={0}
              right={'0px'}
              bottom={0}
              zIndex={999}
              w={'300px'}
            >
              {/* <Canvas
                camera={{ position: [3, 3, 10] }}
                
              >
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={0.8}
                  color={0xffccaa}
                  castShadow
                />
                <ambientLight intensity={5.5} />
                <pointLight
                  position={[5, 5, 5]}
                  color={0xff0000}
                  intensity={1}
                />
              
                <mesh
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, -5, 0]}
                  receiveShadow
                >
                  <planeGeometry args={[100, 100]} />
                  <shadowMaterial opacity={0.5} />
                </mesh>
              </Canvas> */}
            </Box>
          </Box>
          {/* <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          > */}
          <Box
            style={{
              transform: `scale(${showNote ? 0.2 : 1})`,
              transition: 'transform 0.5s ease-in-out',
            }}
            position={'fixed'}
            w={'40%'}
            h={'80vh'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Img w={'100%'} h={'80vh'} src={note} />
            <Box
              position={'fixed'}
              overflowY={'scroll'}
              transform={'translate(0px, 45px)'}
              w={'50%'}
              mt={'10px'}
              display={'flex'}
              flexDirection={'column'}
              textAlign={'center'}
              justifyContent={'center'}
              style={{
                fontWeight: '900',
                color: '#D9C7A2',
                fontSize: '18px',
                fontFamily: 'AtlantisContent',
                lineHeight: 1,
              }}
            >
              <Box
                w={'100%'}
                overflowY={'scroll'}
                h={'100px'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                mt={'20px'}
              >
                {data?.blockText}
              </Box>
              <Box
                w={'100%'}
                onClick={() => getData(data)}
                mt={'20px'}
                display={'flex'}
                justifyContent={'center'}
                cursor={'pointer'}
              >
                <Img src={next} w={'200px'} h={'60px'} />
              </Box>
            </Box>
          </Box>
          {/* </motion.div> */}
        </Box>
      )}
      {data && type === 'Dialog' && (
        <Box
          w={'100%'}
          h={'100vh'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          position={'relative'}
        >
          <Img
            src={backGroundImg}
            maxW={'100%'}
            maxH={'100%'}
            w={'100%'}
            h={'100vh'}
            transform={'scale(1.3}) translateY(-10%) translateX(-10%)'}
            transition={'transform 0.9s ease-in-out'}
          />
          {selectedPlayer && (
            <Img
              src={`${API_SERVER}/${selectedPlayer}`}
              position={'fixed'}
              right={'300px'}
              bottom={'100px'}
              w={'200px'}
              h={'324px'}
              // transform={'translate(0px, 55px)'}
            />
          )}
          {selectedNpc && (
            <Img
              src={selectedNpc}
              position={'fixed'}
              right={'500px'}
              bottom={'100px'}
              w={'200px'}
              h={'324px'}
              // transform={'translate(0px, 55px)'}
            />
          )}
          <Img
            style={{
              transform: `translateY(${showNote ? 200 : 0}px)`,
              transition:
                'transform 0.3s ease-in-out, translateY 0.3s ease-in-out',
            }}
            position={'fixed'}
            maxW={'100%'}
            maxH={'100%'}
            w={'100%'}
            h={'240px'}
            bottom={'0'}
            src={dial}
          />
          {!showNote && (
            <>
              <Box position={'relative'}>
                <Img
                  src={char}
                  position={'fixed'}
                  h={'70px'}
                  w={'25%'}
                  left={'13%'}
                  bottom={'150px'}
                />
                <Text
                  position={'fixed'}
                  left={'24%'}
                  bottom={'167px'}
                  fontSize={'25'}
                  fontWeight={700}
                  textAlign={'center'}
                  fontFamily={'AtlantisText'}
                >
                  {data.blockRoll === 'Narrator'
                    ? data.blockRoll
                    : formData.gameNonPlayerName}
                </Text>
              </Box>
              <Box
                display={'flex'}
                position={'fixed'}
                justifyContent={'space-between'}
                w={'75%'}
                bottom={'55px'}
                fontFamily={'AtlantisContent'}
                fontSize={'21px'}
              >
                <TypingEffect text={data?.blockText} speed={50} />
              </Box>
              <Box
                display={'flex'}
                position={'fixed'}
                justifyContent={'space-between'}
                w={'80%'}
                bottom={'0'}
              >
                <Img src={left} w={'50px'} h={'50px'} cursor={'pointer'} />
                <Img
                  src={right}
                  w={'50px'}
                  h={'50px'}
                  cursor={'pointer'}
                  onClick={() => getData(data)}
                />
              </Box>
            </>
          )}
        </Box>
      )}
      {data && type === 'Interaction' && (
        <Box
          w={'100%'}
          h={'100vh'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          position={'relative'}
        >
          <Img
            src={backGroundImg}
            maxW={'100%'}
            maxH={'100%'}
            w={'100%'}
            h={'100vh'}
            transform={`scale(1.5}) translateY(-10%) translateX(${
              showNote ? -200 : 0
            }px)`}
            transition={'transform 0.9s ease-in-out'}
          />
          {selectedPlayer && (
            <Img
              src={`${API_SERVER}/${selectedPlayer}`}
              position={'fixed'}
              right={'300px'}
              bottom={'100px'}
              w={'200px'}
              h={'auto'}
              transform={'translate(100px, 0px)'}
              transition={'transform 2s ease-in-out'}
            />
          )}
          {selectedNpc && (
            <Img
              src={selectedNpc}
              position={'fixed'}
              right={'500px'}
              bottom={'100px'}
              w={'200px'}
              h={'auto'}
              transform={'translate(100px, 0px)'}
              transition={'transform 2s ease-in-out'}
            />
          )}
          <Box
            style={{
              transform: `translateX(${showNote ? -200 : 0}px) scale(1.2)`,
              transition:
                'transform 0.3s ease-in-out, translateY 0.3s ease-in-out',
            }}
            backgroundImage={parch}
            position={'fixed'}
            w={{ sm: '350px', md: '500px' }}
            h={{ sm: '50vh', md: ' 550px' }}
            // top={'4vh'}
            left={{ sm: '60px', md: '180px' }}
            backgroundSize={'contain'}
            backgroundRepeat={'no-repeat'}
          >
            <Box
              textAlign={'center'}
              h={'100px'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              fontWeight={700}
              fontFamily={'AtlantisText'}
              lineHeight={1}
              w={'100%'}
            >
              <Box w={'50%'} fontSize={'21px'}>
                Here You Can Answer the Interactions...!{' '}
              </Box>
            </Box>
            <Box
              textAlign={'center'}
              h={'100px'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              fontWeight={500}
              fontFamily={'AtlantisText'}
              lineHeight={1}
              w={'96%'}
              overflowY={'scroll'}
            >
              <Box w={'60%'} fontSize={'20px'} letterSpacing={1}>
                {data?.blockText}
              </Box>
            </Box>
            <Box
              mt={'10px'}
              w={{ sm: '200px', md: '400px' }}
              fontWeight={500}
              ml={'17%'}
              h={'220px'}
              overflowY={'scroll'}
            >
              {options &&
                options.map((item: any, ind: number) => (
                  <Box
                    mb={'10px'}
                    w={'80%'}
                    lineHeight={1}
                    key={ind}
                    color={option === ind ? 'purple' : ''}
                    textAlign={'center'}
                    cursor={'pointer'}
                    onClick={() => optionClick(item, ind)}
                    fontFamily={'AtlantisText'}
                    fontSize={'20px'}
                  >
                    <Img src={option === ind ? on : off} h={'30px'} w={'95%'} />
                    {item?.qpOptionText}
                  </Box>
                ))}
            </Box>
            <Box
              display={'flex'}
              position={'fixed'}
              justifyContent={'space-between'}
              w={'508px'}
              left={'-10px'}
            >
              <Img src={left} w={'50px'} h={'50px'} cursor={'pointer'} />
              {option !== null && (
                <Img
                  src={right}
                  w={'50px'}
                  h={'50px'}
                  cursor={'pointer'}
                  onClick={() => InteractionFunction()}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
      {data && type === 'response' && (
        <Box
          w={'100%'}
          h={'100vh'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          position={'relative'}
        >
          <Img
            src={backGroundImg}
            maxW={'100%'}
            maxH={'100%'}
            w={'100%'}
            h={'100vh'}
            transform={'scale(1.3}) translateY(-10%) translateX(-10%)'}
            transition={'transform 0.9s ease-in-out'}
          />
          {selectedPlayer && (
            <Img
              src={`${API_SERVER}/${selectedPlayer}`}
              position={'fixed'}
              right={'300px'}
              bottom={'100px'}
              w={'200px'}
              h={'324px'}
              // transform={'translate(0px, 55px)'}
            />
          )}
          {selectedNpc && (
            <Img
              src={selectedNpc}
              position={'fixed'}
              right={'500px'}
              bottom={'100px'}
              w={'200px'}
              h={'324px'}
              // transform={'translate(0px, 55px)'}
            />
          )}
          <Img
            style={{
              transform: `translateY(${showNote ? 200 : 0}px)`,
              transition:
                'transform 0.3s ease-in-out, translateY 0.3s ease-in-out',
            }}
            position={'fixed'}
            maxW={'100%'}
            maxH={'100%'}
            w={'100%'}
            h={'240px'}
            bottom={'0'}
            src={dial}
          />
          {!showNote && (
            <>
              <Box position={'relative'}>
                <Img
                  src={char}
                  position={'fixed'}
                  h={'70px'}
                  w={'25%'}
                  left={'13%'}
                  bottom={'150px'}
                />
                <Text
                  position={'fixed'}
                  left={'24%'}
                  bottom={'167px'}
                  fontSize={'25'}
                  fontWeight={700}
                  textAlign={'center'}
                  fontFamily={'AtlantisText'}
                >
                  {data.blockRoll === 'Narrator'
                    ? data.blockRoll
                    : formData.gameNonPlayerName}
                </Text>
              </Box>
              <Box
                display={'flex'}
                position={'fixed'}
                justifyContent={'space-between'}
                w={'75%'}
                bottom={'55px'}
                fontFamily={'AtlantisContent'}
                fontSize={'21px'}
              >
                <TypingEffect text={resMsg} speed={50} />
              </Box>
              <Box
                display={'flex'}
                position={'fixed'}
                justifyContent={'space-between'}
                w={'80%'}
                bottom={'0'}
              >
                <Img src={left} w={'50px'} h={'50px'} cursor={'pointer'} />
                <Img
                  src={right}
                  w={'50px'}
                  h={'50px'}
                  cursor={'pointer'}
                  onClick={() => getData(data)}
                />
              </Box>
            </>
          )}
        </Box>
        // <Box
        //   w={'100%'}
        //   h={'100vh'}
        //   display={'flex'}
        //   alignItems={'center'}
        //   justifyContent={'center'}
        //   position={'relative'}
        // >
        //   <Img
        //     src={backGroundImg}
        //     maxW={'100%'}
        //     maxH={'100%'}
        //     w={'100%'}
        //     h={'100vh'}
        //     transform={'scale(1.3}) translateY(-10%) translateX(-10%)'}
        //     transition={'transform 0.9s ease-in-out'}
        //   />
        //   <Img
        //     style={{
        //       transform: `translateY(${showNote ? 200 : 0}px)`,
        //       transition:
        //         'transform 0.3s ease-in-out, translateY 0.3s ease-in-out',
        //     }}
        //     position={'fixed'}
        //     maxW={'100%'}
        //     maxH={'100%'}
        //     w={'100%'}
        //     h={'240px'}
        //     bottom={'0'}
        //     src={dial}
        //   />
        //   {!showNote && (
        //     <>
        //       <Box
        //         backgroundImage={char}
        //         position={'fixed'}
        //         h={'70px'}
        //         w={'25%'}
        //         left={'13%'}
        //         fontSize={'25'}
        //         display={'flex'}
        //         alignItems={'center'}
        //         justifyContent={'center'}
        //         fontWeight={700}
        //         textAlign={'center'}
        //         bottom={'150px'}
        //         backgroundRepeat={'no-repeat'}
        //         backgroundSize={'contain'}
        //         fontFamily={'albuma'}
        //       >
        //         Logan
        //         {/* {data.character === '999999'
        //             ? 'Player'
        //             : data.character === '99999'
        //             ? 'Narrator'
        //             : formData.gameNonPlayerName} */}
        //       </Box>
        //       <Box
        //         display={'flex'}
        //         position={'fixed'}
        //         justifyContent={'space-between'}
        //         w={'75%'}
        //         bottom={'55px'}
        //         fontFamily={'cont'}
        //       >
        //         {resMsg}
        //       </Box>
        //       <Box
        //         display={'flex'}
        //         position={'fixed'}
        //         justifyContent={'space-between'}
        //         w={'80%'}
        //         bottom={'0'}
        //       >
        //         <Img src={left} w={'50px'} h={'50px'} cursor={'pointer'} />
        //         <Img
        //           src={right}
        //           w={'50px'}
        //           h={'50px'}
        //           cursor={'pointer'}
        //           onClick={() => getData(data)}
        //         />
        //       </Box>
        //     </>
        //   )}
        // </Box>
      )}
      {data && type === 'feedback' && (
        <Box
          w={'100%'}
          h={'100vh'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          position={'relative'}
          overflow={'visible'}
          style={{ perspective: '1000px' }}
        >
          <Box
            backgroundImage={backGroundImg}
            w={'100%'}
            h={'100vh'}
            backgroundRepeat={'no-repeat'}
            backgroundSize={'cover'}
            transform={`scale(${first ? 1 : 1.3}) translateY(${
              first ? 0 : -10
            }%) translateX(${first ? 0 : -10}%)`}
            transition={'transform 0.9s ease-in-out'}
          >
            <Box
              position={'fixed'}
              top={'200px'}
              right={'0px'}
              bottom={0}
              zIndex={999}
              w={'300px'}
            >
              {/* <Canvas
                camera={{ position: [3, 3, 10] }}
                
              >
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={0.8}
                  color={0xffccaa}
                  castShadow
                />
                <ambientLight intensity={5.5} />
                <pointLight
                  position={[5, 5, 5]}
                  color={0xff0000}
                  intensity={1}
                />
              
                <mesh
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, -5, 0]}
                  receiveShadow
                >
                  <planeGeometry args={[100, 100]} />
                  <shadowMaterial opacity={0.5} />
                </mesh>
              </Canvas> */}
            </Box>
          </Box>
          <Box
            style={{
              transform: `scale(${showNote ? 0.2 : 1})`,
              transition: 'transform 0.5s ease-in-out',
            }}
            position={'fixed'}
            w={'40%'}
            h={'80vh'}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Img w={'90%'} h={'80vh'} src={feedi} />
            <Box
              position={'fixed'}
              w={'50%'}
              mt={'10px'}
              display={'flex'}
              flexDirection={'column'}
              textAlign={'center'}
              justifyContent={'center'}
              style={{
                fontWeight: '900',
                color: '#D9C7A2',
              }}
            >
              {feed}
              <Box
                w={'100%'}
                onClick={() => getData(data)}
                mt={'20px'}
                display={'flex'}
                justifyContent={'center'}
                cursor={'pointer'}
                transform={'translate(0px, 100px)'}
              >
                <Img src={next} w={'200px'} h={'60px'} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
export default Story;
