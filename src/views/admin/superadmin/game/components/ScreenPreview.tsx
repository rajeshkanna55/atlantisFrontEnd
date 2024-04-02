// Chakra Imports
import {
  Box,
  Flex,
  Text,
  Img,
  Grid,
  GridItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react';
import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import TakeAwaysContentScreen from './onimage/TakeAwaysScreen';
// import Sample from '../../../../assets/img/games/Character_sample.glb';
// import WelcomeContentScreen from './onimage/WelcomeContentScreen';
import Screen1 from '../../../../../assets/img/screens/screen1.png';
import leaderboard from '../../../../../assets/img/screens/Leaderboard.png';

import ReflectionContentScreen from './onimage/ReflectionScreen';
import TyContentScreen from './onimage/TyContentScreen';
import { getGameCreatorDemoData } from 'utils/game/gameService';
import TypingEffect from '../demoplay/playcards/Typing';
import { API_SERVER, Notelength, Dialoglength, Responselength } from 'config/constant';
import { lazy } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { preloadedImages } from 'utils/hooks/function';
import { assetImageSrc } from 'utils/hooks/imageSrc';
import { updatePreviewData } from 'store/preview/previewSlice';
import LeaderBoard from '../demoplay/playcards/Leaderboard';

const WelcomeContentScreen = lazy(() => import('./onimage/WelcomeContentScreen'));
// const WelcomeContentScreen = lazy(
//   () => import('./onimage/PreviewWelcomeScreen'),
// );
const CompletionContentScreen = lazy(
  () => import('./onimage/CompletionContentScreen'),
);
const PreviewEndOfStory = lazy(() => import('./onimage/PreviewEndOfStory'));
const ScreenPreview = () => {
  const {
    gameId: id,
    currentTab: currentTab,
    currentSubTab: currentSubTab,
    currentQuest: currentQuest,
    activeBlockSeq: activeBlockSeq,
    isDispatched: isDispatched,
    CompKeyCount: CompKeyCount,
    reflectionPageUpdated: reflectionPageUpdated,
  } = useSelector((state: RootState) => state.preview);
  const dispatch = useDispatch();
  const [gameInfo, setGameInfo] = useState<any>();
  const [contentReady, setContentReady] = useState<boolean>(false);
  const [apiImageSet, setApiImageSet] = useState<any>();
  const [staticAssetImageUrls, setStaticAssetImageUrls] = useState<any>(null);
  const [apiUrlAssetImageUrls, setApiUrlAssetImageUrls] = useState<any>(null); //preloaded Api image urls
  // const [preloadedAssets, setPreloadedAssets] = useState<any>();
  const [demoBlocks, setDemoBlocks] = useState(null);
  const [navi, setNavi] = useState<string>('');
  const [options, setOptions] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionNavigation, setOptionNavigation] = useState(null);
  const [showNote, setShowNote] = useState(false),
    [first, setFirst] = useState(false);
  const [game3Position, setGame3Position] = useState({
    previousBlock: '',
    currentBlock: '',
    nextBlock: '',
  });
  const [data, setData] = useState(null);
  const [type, setType] = useState<string>('');
  const [resMsg, setResMsg] = useState<string>('');

  const [feed, setFeed] = useState<string>('');
  const [endOfQuest, setEndOfQuest] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [remainingSentences, setRemainingSentences] = useState<any[]>([]);
  const [showTypingEffect, setShowTypingEffect] = useState<any>(false);
  const [Navigatenext, setNavigateNext] = useState<any>(false);
  const reflectionQuestionsdefault = [
    'What were your biggest learnings?',
    'How can you apply these learnings back at work?',
    "'What's one thing you learned about your mindset?",
    "What's one thing you are committing to change?",
  ];
  const [reflectionQuestions, setReflectionQuestions] = useState({
    ref1: 'What were your biggest learnings?',
    ref2: 'How can you apply these learnings back at work?',
    ref3: "What's one thing you learned about your mindset?",
    ref4: "What's one thing you are committing to change?",
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const resolvedResult: any = await preloadedImages(assetImageSrc);
      setStaticAssetImageUrls(resolvedResult);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (gameInfo) {
      setDemoBlocks(gameInfo?.blocks);
      const currentBlock = gameInfo?.blocks[currentQuest][activeBlockSeq];
      setType(currentBlock?.blockChoosen);
      if (currentBlock?.blockChoosen === 'Interaction') {
        setInteractionOptions(gameInfo, currentBlock);
      }
      setData(currentBlock);
    }
    setCurrentPosition(0);
  }, [gameInfo, isDispatched, activeBlockSeq, currentQuest]);

  const replayQuest = () => {
    dispatch(updatePreviewData({ activeBlockSeq: 1, isDispatched: true }));
    setEndOfQuest(false);
  };
  const fetchDataFromApi = useCallback(async () => {
    try {
      if (id && isDispatched) {
        const gamedata = await getGameCreatorDemoData(id);
        if (!gamedata.error && gamedata) {
          const {
            gameview,
            image,
            lmsblocks,
            lmsquestionsoptions,
            gameQuest,
            ...gameData
          } = gamedata?.result;
          const sortBlockSequence = (blockArray: []) => {
            const transformedArray = blockArray.reduce(
              (result: any, obj: any) => {
                const groupKey = obj?.blockQuestNo.toString();
                const seqKey = obj?.blockPrimarySequence
                  .toString()
                  ?.split('.')[1];
                if (!result[groupKey]) {
                  result[groupKey] = {};
                }
                result[groupKey][seqKey] = obj;
                return result;
              },
              {},
            );
            return transformedArray;
          };
          const completionOptions = gameQuest.map((qst: any, i: number) => {
            const item = {
              gameId: qst.gameId,
              questNo: qst.gameQuestNo,
              gameIsSetMinPassScore: qst.gameIsSetMinPassScore,
              gameIsSetDistinctionScore: qst.gameIsSetDistinctionScore,
              gameDistinctionScore: qst.gameDistinctionScore,
              gameIsSetSkillWiseScore: qst.gameIsSetSkillWiseScore,
              gameIsSetBadge: qst.gameIsSetBadge,
              gameBadge: qst.gameBadge,
              gameBadgeName: qst.gameBadgeName,
              gameIsSetCriteriaForBadge: qst.gameIsSetCriteriaForBadge,
              gameAwardBadgeScore: qst.gameAwardBadgeScore,
              gameScreenTitle: qst.gameScreenTitle,
              gameIsSetCongratsSingleMessage:
                qst.gameIsSetCongratsSingleMessage,
              gameIsSetCongratsScoreWiseMessage:
                qst.gameIsSetCongratsScoreWiseMessage,
              gameCompletedCongratsMessage: qst.gameCompletedCongratsMessage,
              gameMinimumScoreCongratsMessage:
                qst.gameMinimumScoreCongratsMessage,
              gameaboveMinimumScoreCongratsMessage:
                qst.gameaboveMinimumScoreCongratsMessage,
              gameLessthanDistinctionScoreCongratsMessage:
                qst.gameLessthanDistinctionScoreCongratsMessage,
              gameAboveDistinctionScoreCongratsMessage:
                qst.gameAboveDistinctionScoreCongratsMessage,
            };
            return item;
          });

          let reflectionData: any = [];
          for (let i = 0; i < gamedata?.resultReflection?.length; i++) {
            let filteredValue = gamedata?.resultReflection.find(
              (refRow: any) => refRow?.refKey == `ref${i + 1}`,
            );
            reflectionData[filteredValue?.refKey] = filteredValue?.refQuestion;
          }
          setGameInfo({
            gameId: id,
            gameData: gameData,
            gameHistory: gameview,
            assets: image,
            blocks: sortBlockSequence(lmsblocks),
            gameQuest: gameQuest, //used for completion screen
            completionQuestOptions: completionOptions,
            questOptions: lmsquestionsoptions,
            reflectionQuestions:
              gamedata?.resultReflection.length > 0
                ? reflectionData
                : reflectionQuestions,
            gamePlayers: gamedata?.assets?.playerCharectorsUrl,
            bgMusic:
              gamedata?.assets?.bgMusicUrl &&
              API_SERVER + '/' + gamedata?.assets?.bgMusicUrl,
            gameNonPlayerUrl:
              gamedata?.assets?.npcUrl &&
              API_SERVER + '/' + gamedata?.assets?.npcUrl,
            badges: await gamedata?.assets?.badges?.map(
              (path: string) => API_SERVER + '/' + path,
            ),
          });

          const apiImageSetArr: any = [
            { assetType: 'backgroundImage', src: image?.gasAssetImage },
            {
              assetType: 'nonplayerImage',
              src: API_SERVER + '/' + gamedata?.assets?.npcUrl,
            },
          ];

          let playerCharectorsUrls = gamedata?.assets?.playerCharectorsUrl.map(
            (item: any, index: number) => {
              let objValue = API_SERVER + '/' + item;
              let objKey = `playerCharacterImage_${index}`;
              apiImageSetArr.push({ assetType: objKey, src: objValue });
            },
          );
          let gameQuestBadges = await Promise.all(
            gamedata?.assets?.badges.map(
              async (item: Record<string, string>) => {
                Object.entries(item).forEach(([key, value]) => {
                  let objkeyValue = key.split('_')[1];
                  let objKey = `Quest_${objkeyValue}`;
                  let objKeyValue = API_SERVER + '/' + value;
                  apiImageSetArr.push({ assetType: objKey, src: objKeyValue });
                });
                setApiImageSet(apiImageSetArr);
                return true;
              },
            ),
          );
        }
      } else {
        console.log('game id is missing...');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id, isDispatched]);
  const setInteractionOptions = (gameInfo: any, currentBlock: any) => {
    console.log('currentBlock', currentBlock)
    const optionsFiltered = gameInfo?.questOptions.filter(
      (key: any) => key?.qpSequence === currentBlock?.blockPrimarySequence,
    );
    console.log('optionsFiltered', optionsFiltered);
    if (gameInfo?.gameData?.gameShuffle === 'true') {
      for (let i = optionsFiltered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsFiltered[i], optionsFiltered[j]] = [
          optionsFiltered[j],
          optionsFiltered[i],
        ];
      }
      setOptions(optionsFiltered);
    }
  };

  useEffect(() => {
    if (id && isDispatched) {
      fetchDataFromApi();
      dispatch(updatePreviewData({ isDispatched: false }));
    }
  }, [id, isDispatched]);

  useEffect(() => {
    const fetchData = async () => {
      const resolvedResult: any = await preloadedImages(apiImageSet);
      setApiUrlAssetImageUrls(resolvedResult);
    };
    apiImageSet && fetchData();
  }, [apiImageSet]);


  const preloadedAssets = useMemo(() => {
    return { ...apiUrlAssetImageUrls, ...staticAssetImageUrls };
  }, [apiUrlAssetImageUrls, staticAssetImageUrls]);

  useEffect(() => {
    if (gameInfo && preloadedAssets) {
      setContentReady(true);
    } else {
      setContentReady(false);
    }
  }, [gameInfo, preloadedAssets]);

  useEffect(() => {
    dispatch(updatePreviewData({ isDispatched: false }));
  }, [CompKeyCount]);

  const previousData = (current: any) => {
    setCurrentPosition(0);
    const currentBlock = current
      ? parseInt(current?.blockPrimarySequence.split('.')[1])
      : null;
    const PrevItem = currentBlock != null ? currentBlock - 1 : null;

    const prevSeq =
      game3Position.previousBlock !== ''
        ? game3Position.previousBlock
        : current
          ? `${current?.blockPrimarySequence.split('.')[0]}.${PrevItem}`
          : '';

    const quest = current ? current?.blockPrimarySequence.split('.')[0] : null;
    const currentQuest = current
      ? parseInt(current?.blockPrimarySequence.split('.')[0])
      : null;
    const prevLevel = currentQuest != null ? String(currentQuest + 1) : null;
    const prevBlock = current
      ? Object.keys(demoBlocks[quest] || {})
        .filter(
          (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === prevSeq,
        )
        .map((key: any) => demoBlocks[quest]?.[key])
      : [];
    if (
      prevBlock.length !== 0 &&
      prevBlock[0]?.blockChoosen !== 'Interaction'
    ) {
      setType(prevBlock[0]?.blockChoosen);
      setData(prevBlock[0]);
    }
  };
  const getData = (next: any) => {
    console.log('next', next);
    const currentBlock = next
      ? parseInt(next?.blockPrimarySequence.split('.')[1])
      : null;
    const NextItem = currentBlock != null ? currentBlock + 1 : null;
    const nextSeq = next
      ? `${next?.blockPrimarySequence.split('.')[0]}.${NextItem}`
      : '';

    const quest = next ? next?.blockPrimarySequence.split('.')[0] : null;
    const nextLevel = currentQuest != null ? String(currentQuest + 1) : null;
    
    //get the next block, it could be used when current block not has navigation
    const nextBlock = next
      ? Object.keys(demoBlocks[quest] || {})
        .filter(
          (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === nextSeq,
        )
        .map((key: any) => {
          return demoBlocks[quest]?.[key];
        })
      : [];

    // {/* Check wheather has next block or not, if not then show End of Current Quest.
    //       Want to play next quest, then switch the current quest in game creation screen */}
    // if (nextBlock[0]?.blockChoosen === 'Interaction') {
    //   setInteractionOptions(gameInfo, next);
    // }
    console.log('nextBlock[0]?.blockChoosen === Interaction', nextBlock[0]?.blockChoosen === 'Interaction')
    if (nextBlock[0]?.blockChoosen === 'Interaction') {
      // setInteractionOptions(gameInfo, nextBlock[0]);
      setInteractionOptions(gameInfo, next);
    }
   console.log('next?.blockShowNavigate',next?.blockShowNavigate)
    if (type === 'Interaction' && resMsg !== '') {
      setType('response');
      return false;
    } else if ((type === 'Interaction' || type === 'response') && feed !== '') {
      setType('feedback');
      return false;
    } else if (
      type === 'Interaction' ||
      type === 'response' ||
      type === 'feedback'
    ) {
      console.log('navi----', navi)
      if (navi === 'Repeat Question') {
        const currentBlockinteraction = gameInfo?.blocks[currentQuest][currentBlock];
        setInteractionOptions(gameInfo, currentBlockinteraction);
        setType(demoBlocks[currentQuest][currentBlock]?.blockChoosen);
        setData(demoBlocks[currentQuest][currentBlock]);
        setSelectedOption(null);
        return false;
      } else if (navi === 'New Block') {
        setType(nextBlock[0]?.blockChoosen);
        setData(nextBlock[0]);
        setSelectedOption(null);
        return false;
      } else if (navi === 'Replay Point') {
        setType(demoBlocks[currentQuest]['1']?.blockChoosen);
        setData(demoBlocks[currentQuest]['1']);
        setSelectedOption(null);
        return false;
      } else if (navi === 'Select Block') {
        const selectedNext = Object.keys(demoBlocks[currentQuest])
          .filter((item: any) => {
            return (
              demoBlocks[currentQuest][item]?.blockSecondaryId ===
              parseInt(optionNavigation)
            );
          })
          .map((item: any) => {
            return demoBlocks[currentQuest][item];
          });         
        if (selectedNext.length > 0) {
          setType(selectedNext && selectedNext[0]?.blockChoosen);
          setData(selectedNext && selectedNext[0]);
        }
        else {
          setType(nextBlock[0]?.blockChoosen);
          setData(nextBlock[0]);
        }
        setSelectedOption(null);
        return false;
      } else if (navi === 'Complete') {
        // if (demoBlocks.hasOwnProperty(nextLevel)) {
        //   setType(demoBlocks[nextLevel]['1']?.blockChoosen);
        //   setData(demoBlocks[nextLevel]['1']);
        //   return false;
        // } else {
        //   setType(null);
        //   setData(null);
        //   return false;
        // }
        setEndOfQuest(true);
      } else {
        console.log('navi === null');
        console.log('nextBlock.length === 0', nextBlock.length === 0);
        
        if(nextBlock.length === 0)
        {
          setEndOfQuest(true);
        }
        else{
          setType(nextBlock[0]?.blockChoosen);
          setData(nextBlock[0]);
          setSelectedOption(null);
          return false;
        }
      }
    }
    else if (next?.blockShowNavigate) {
      console.log('next?.blockShowNavigate == true /// type ', type );
      if (next?.blockShowNavigate === 'Repeat Question') {
        setType(next?.blockChoosen);
        setData(next);
        return false;
      } else if (next?.blockShowNavigate === 'New Block') {
        setType(nextBlock[0]?.blockChoosen);
        setData(nextBlock[0]);
        setSelectedOption(null);
        return false;
      } else if (next?.blockShowNavigate === 'Replay Point') {
        setType(demoBlocks[currentQuest]['1']?.blockChoosen);
        setData(demoBlocks[currentQuest]['1']);
        setSelectedOption(null);
        return false;
    } else if (next?.blockShowNavigate === 'Select Block') {
      console.log("In Selected Blocks")
      console.log("currentQuest", currentQuest)
      console.log("demoBlocks[currentQuest]",demoBlocks[currentQuest])
      console.log('next?.blockLeadTo', next?.blockLeadTo)

      const selectedNext = Object.keys(demoBlocks[currentQuest])
        .filter((item: any) => {
          return (
            demoBlocks[currentQuest][item]?.blockSecondaryId ===
            parseInt(next?.blockLeadTo)
          );
        })
        .map((item: any) => {
          return demoBlocks[currentQuest][item];
        });
        console.log('selectedNext', selectedNext)
        if (selectedNext.length > 0) {
        console.log('selectedNext.length > 0', selectedNext.length > 0)
        console.log('selectedNext[0]?.blockChoosen', selectedNext[0]?.blockChoosen)
        setType(selectedNext && selectedNext[0]?.blockChoosen);
          // if(selectedNext[0]?.blockChoosen === 'Interaction')
          //   {
          //     const optionsFiltered = [];
          //     for (const option of gameInfo.questOptions) {
          //         if (option?.qpSequence ===  selectedNext[0]?.blockPrimarySequence) {
          //           optionsFiltered.push(option);
          //         }
          //     }
          //     if (gameInfo?.gameData?.gameShuffle === 'true') {
          //             for (let i = optionsFiltered.length - 1; i > 0; i--) {
          //               const j = Math.floor(Math.random() * (i + 1));
          //               [optionsFiltered[i], optionsFiltered[j]] = [
          //                 optionsFiltered[j],
          //                 optionsFiltered[i],
          //               ];
          //             }
          //           }
          //     setOptions(optionsFiltered);
                
          //   }
      setData(selectedNext && selectedNext[0]);
    }
    else {
      console.log('Else');
      
      setType(nextBlock[0]?.blockChoosen);
      // if(nextBlock[0]?.blockChoosen === 'Interaction')
      // {
      //   const optionsFiltered = [];
      //   for (const option of gameInfo.questOptions) {
      //       if (option?.qpSequence ===  nextBlock[0]?.blockPrimarySequence) {
      //         optionsFiltered.push(option);
      //       }
      //   }
      //         if (gameInfo?.gameData?.gameShuffle === 'true') {
      //           for (let i = optionsFiltered.length - 1; i > 0; i--) {
      //             const j = Math.floor(Math.random() * (i + 1));
      //             [optionsFiltered[i], optionsFiltered[j]] = [
      //               optionsFiltered[j],
      //               optionsFiltered[i],
      //             ];
      //           }
      //         }
      //         setOptions(optionsFiltered);
      // }
      setData(nextBlock[0]);
    }
    setSelectedOption(null);
      return false;
    }
      else if (next?.blockShowNavigate === 'Complete') {
        setEndOfQuest(true);
        return false;
      }
      else{
        setEndOfQuest(true);
        return false;
      }
    }
    else if(nextBlock.length > 0 )
    {
      setType(nextBlock[0]?.blockChoosen);
      setData(nextBlock[0]);
      setSelectedOption(null);
    }
    else{
      setEndOfQuest(true);
    }
  };
  const handleValidate = (item: any, ind: number) => {
    setResMsg(item?.qpResponse);
    setFeed(item?.qpFeedback);
    setNavi(item?.qpNavigateShow);
    setOptionNavigation(item?.qpNextOption);
    setSelectedOption(ind === selectedOption ? null : ind);
  };
  const handleEntirePrev = async () => {
    const url = ` /game/creator/demoplay/${id}`;
    window.open(url, '_blank');
  };
  useEffect(() => {
    getDataSection(data);
  }, [data, type]);
  useEffect(() => {
    if (Navigatenext === true) {
      getData(data);
    }
  }, [Navigatenext]);
  const getDataSection = (data: any) => {
    setShowTypingEffect(false);
    // Note and Dialog
    const content = data?.blockText || '';
    const sentences = content.split(
      /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/,
    );
    const newRemainingSentences = sentences.slice(currentPosition);
    // Response 
    const Responsecontent = resMsg || '';
    const Responsesentences = Responsecontent.split(
      /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/,
    );
    const newRemainingResponseSentences = Responsesentences.slice(currentPosition);

    const concatenatedSentences = [];
    let totalLength = 0;
    // Note and Dialog
    for (let i = 0; i < newRemainingSentences.length; i++) {
      const sentence = newRemainingSentences[i];
      if (data && type === 'Note') {
        if (totalLength + sentence.length <= Notelength) {
          concatenatedSentences.push(sentence);
          totalLength += sentence.length;
        } else {
          concatenatedSentences.push(sentence);
          break;
        }
      }
      if (data && type === 'Dialog') {
        if (totalLength + sentence.length <= Dialoglength) {
          concatenatedSentences.push(sentence);
          totalLength += sentence.length;
        } else {
          if (totalLength + sentence.length >= Dialoglength) {
            break;
          }
          concatenatedSentences.push(sentence);
          break;
        }
      }
    }
    // Response 
    for (let i = 0; i < newRemainingResponseSentences.length; i++) {
      const ressentence = newRemainingResponseSentences[i];
      if (data && type === 'response') {
        if (totalLength + ressentence.length <= Responselength) {
          concatenatedSentences.push(ressentence);
          totalLength += ressentence.length;
        } else {
          if (totalLength + ressentence.length >= Responselength) {
            break;
          }
          concatenatedSentences.push(ressentence);
          break;
        }
      }
    }

    setRemainingSentences(concatenatedSentences);

    if (newRemainingSentences.length >= 1) {
      setCurrentPosition(currentPosition + concatenatedSentences.length);
      setNavigateNext(false);
    }
    else if (newRemainingResponseSentences.length >= 1) {
      setCurrentPosition(currentPosition + concatenatedSentences.length);
      setNavigateNext(false);
    }
    else {
      setCurrentPosition(0);
      setNavigateNext(true);
    }
  };
  const Updatecontent = () => {
    if (showTypingEffect === false) {
      setShowTypingEffect(true);
    }
    else {
      getDataSection(data);
    }
  }
  useEffect(() => {
    getDataSection(data);
  }, []);
  const handleCloseWindow = () => {
    window.close();
  };

  return (
    <Box id="container">
      <Suspense fallback={<h1>Loading please wait...</h1>}>
        {contentReady && (
          <motion.div
            initial={{ opacity: 0, background: '#000' }}
            animate={{ opacity: 1, background: '#0000' }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Box id="EntirePreview-wrapper">
              <Box className="EntirePreview-content">
                <Box h={'100vh !important'} className="Images">
                  <Flex height="100vh" className="EntirePreview">
                    {currentTab === 3 && (
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                      >
                        <Box
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                          backgroundImage={preloadedAssets.backgroundImage}
                        >
                          <Box className="Images">
                            {gameInfo && (
                              <WelcomeContentScreen
                                // backgroundImage={preloadedAssets.backgroundImage}
                                formData={gameInfo.gameData}
                                imageSrc={preloadedAssets?.Screen5}
                                preview={true}
                                preloadedAssets={preloadedAssets}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    )}
                    {currentTab === 4 && data && type === 'Note' && (
                      <Box
                        position="relative"                       
                        w={'100%'}
                        height="100vh"
                        backgroundImage={preloadedAssets?.backgroundImage}
                        backgroundSize={'cover'}
                        backgroundRepeat={'no-repeat'}
                        className="chapter_potrait"
                      >
                        <Grid
                          templateColumns="repeat(1, 1fr)"
                          gap={4}
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          className="story_note_grid"
                        >
                          <GridItem colSpan={1} position={'relative'}>
                            <Box display={'flex'} justifyContent={'center'}>
                              <Img
                                src={preloadedAssets?.note}
                                className="story_note_image"
                                loading="lazy"
                              />
                              <Box
                                className={'story_note_content'}
                                // bg={'blue.300'}
                              >
                                <Box
                                  w={'100%'}
                                  display={'flex'}
                                  justifyContent={'center'}
                                >
                                  <Box className={'story_note_block'}>
                                    <Text textAlign={'center'}>
                                    {remainingSentences}
                                    </Text>
                                  </Box>
                                </Box>
                                <Box
                                  w={'100%'}
                                  onClick={() => getData(data)}
                                  mt={'20px'}
                                  display={'flex'}
                                  justifyContent={'center'}
                                  cursor={'pointer'}
                                  position={'fixed'}
                                  top={'70%'}
                                >
                                  <Img
                                    src={preloadedAssets.next}
                                    h={'7vh'}
                                    className={'story_note_next_button'}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </GridItem>
                        </Grid>
                      </Box>

                      // old note ui copy

                      // <Box
                      //   w={'100%'}
                      //   h={'100vh'}
                      //   display={'flex'}
                      //   alignItems={'center'}
                      //   justifyContent={'center'}
                      //   position={'relative'}
                      //   overflow={'visible'}
                      //   style={{ perspective: '1000px' }}
                      // >
                      //   <Box
                      //     color={'rgba(0, 0, 0, 0.5)'}
                      //     backgroundImage={preloadedAssets?.backgroundImage}
                      //     w={'100%'}
                      //     h={'100vh'}
                      //     backgroundRepeat={'no-repeat'}
                      //     backgroundSize={'cover'}
                      //     transform={`scale(${first ? 1 : 0.9}) translateY(${
                      //       first ? 0 : -0
                      //     }%) translateX(${first ? 0 : -10}%)`}
                      //     transition={'transform 0.9s ease-in-out'}
                      //   >
                      //     <Box
                      //       position={'fixed'}
                      //       top={'200px'}
                      //       right={'0px'}
                      //       bottom={0}
                      //       zIndex={999}
                      //       w={'300px'}
                      //     >
                      //       <Box
                      //         style={{
                      //           transform: `scale(${showNote ? 0.2 : 1})`,
                      //           transition: 'transform 0.5s ease-in-out',
                      //         }}
                      //         position={'fixed'}
                      //         w={'40%'}
                      //         h={'60vh'}
                      //         display={'flex'}
                      //         flexDirection={'column'}
                      //         justifyContent={'center'}
                      //         alignItems={'center'}
                      //       >
                      //         <Img
                      //           w={'100%'}
                      //           h={'80vh'}
                      //           src={preloadedAssets?.note}
                      //         />
                      //         <Box
                      //           position={'fixed'}
                      //           overflowY={'scroll'}
                      //           transform={'translate(0px, 0px)'}
                      //           w={'50%'}
                      //           mt={'10px'}
                      //           display={'flex'}
                      //           flexDirection={'column'}
                      //           textAlign={'center'}
                      //           justifyContent={'center'}
                      //           style={{
                      //             fontWeight: '900',
                      //             color: '#D9C7A2',
                      //             fontSize: '18px',
                      //             fontFamily: 'AtlantisContent',
                      //             lineHeight: 1,
                      //           }}
                      //         >
                      //           <Box
                      //             w={'100%'}
                      //             overflowY={'scroll'}
                      //             h={'100px'}
                      //             display={'flex'}
                      //             alignItems={'center'}
                      //             justifyContent={'center'}
                      //             mt={'20px'}
                      //           >
                      //             {data?.blockText}
                      //           </Box>
                      //           <Box
                      //             w={'100%'}
                      //             onClick={() => getData(data)}
                      //             mt={'20px'}
                      //             display={'flex'}
                      //             justifyContent={'center'}
                      //             cursor={'pointer'}
                      //           >
                      //             <Img
                      //               src={preloadedAssets.next}
                      //               w={'200px'}
                      //               h={'60px'}
                      //             />
                      //           </Box>
                      //         </Box>
                      //       </Box>
                      //     </Box>
                      //   </Box>
                      // </Box>
                    )}
                    {currentTab === 4 && data && type === 'Dialog' && (
                      <Box className="chapter_potrait">
                        <Img
                          src={preloadedAssets?.backgroundImage}
                          className="dialogue_screen"
                        />
                        {/* <Box w={'100%'} h={'100vh'}>
                           <Canvas camera={{ position: [30, 0, 10] }}>
                             <directionalLight
                               position={[5, 5, 5]}
                               intensity={0.8}
                               color={0xffccaa}
                               castShadow
                             />
                             <ambientLight intensity={5.5} />
                             {/* <pointLight position={[5, 5, 5]} color={0xff0000} intensity={1} /> */}
                        {/* <Background /> */}
                        {/* <Model /> */}
                        {/* <mesh 
                         rotation={[-Math.PI / 2, 0, 0]}
                         position={[0, -5, 0]}
                         receiveShadow 
                       > */}
                        {/* <planeGeometry args={[100, 100]} />
                         <shadowMaterial opacity={0.5} />
                       </mesh> */}
                        {/* </Canvas>
                         </Box> */}
                        {/* {selectedPlayer && (
                           <Img
                             src={`${API_SERVER}/${selectedPlayer}`}
                             position={'fixed'}
                             right={'300px'}
                             bottom={'100px'}
                             w={'200px'}
                             h={'324px'}
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
                           />
                         )} */}
                        <Img
                          className={'dialogue_image'}
                          src={preloadedAssets?.dial}
                        />
                        {!showNote && (
                          <>
                            <Box position={'relative'}>
                              <Img
                                src={preloadedAssets?.char}
                                position={'fixed'}
                                h={'100px'}
                                w={'30%'}
                                left={'5%'}
                                bottom={'93px'}
                              />
                              <Text
                                position={'fixed'}
                                left={{ base: '17%', md: '18%' }}
                                bottom={'118px'}
                                fontSize={{ base: '30px', xl: '2.2vw' }}
                                fontWeight={500}
                                textAlign={'center'}
                                fontFamily={'AtlantisText'}
                                color={'#312821'}
                              >
                                {data.blockRoll === 'Narrator'
                                  ? data.blockRoll
                                  : gameInfo?.gameData?.gameNonPlayerName}
                              </Text>
                            </Box>
                            <Box
                              display={'flex'}
                              position={'fixed'}
                              alignItems={'center'}
                              justifyContent={'space-between'}
                              h={'61px'}
                              overflowY={'scroll'}
                              w={'85%'}
                              fontSize={{ base: '30px', lg: '1.8vw' }}
                              bottom={'38px'}
                              fontFamily={'AtlantisContent'}
                              // fontSize={'21px'}
                            >
                              {showTypingEffect === false ? <TypingEffect
                                text={remainingSentences.toString()}
                                speed={50}
                                setSpeedIsOver={setShowTypingEffect}
                              /> : remainingSentences}


                            </Box>
                            <Box
                              display={'flex'}
                              position={'fixed'}
                              justifyContent={'space-between'}
                              w={'95%'}
                              bottom={'0'}
                            >
                              <Img
                                src={preloadedAssets?.left}
                                w={'70px'}
                                h={'50px'}
                                cursor={'pointer'}
                                onClick={() => previousData(data)}
                              />
                              <Img
                                src={preloadedAssets?.right}
                                w={'70px'}
                                h={'50px'}
                                cursor={'pointer'}
                                onClick={() => Updatecontent()}
                              />
                            </Box>
                          </>
                        )}
                      </Box>
                      // old dialog ui copy
                      // <Box
                      //   w={'100%'}
                      //   h={'100vh'}
                      //   display={'flex'}
                      //   alignItems={'center'}
                      //   justifyContent={'center'}
                      //   position={'relative'}
                      // >
                      //   <Img
                      //     src={preloadedAssets?.backgroundImage}
                      //     maxW={'100%'}
                      //     maxH={'100%'}
                      //     w={'100%'}
                      //     h={'100vh'}
                      //     transform={
                      //       'scale(1.3}) translateY(-10%) translateX(-10%)'
                      //     }
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
                      //     src={preloadedAssets?.dial}
                      //   />
                      //   {!showNote && (
                      //     <>
                      //       <Box position={'relative'}>
                      //         <Img
                      //           src={preloadedAssets?.char}
                      //           position={'fixed'}
                      //           h={'70px'}
                      //           w={'25%'}
                      //           left={'13%'}
                      //           bottom={'150px'}
                      //         />
                      //         <Text
                      //           position={'fixed'}
                      //           left={'24%'}
                      //           bottom={'167px'}
                      //           fontSize={'25'}
                      //           fontWeight={700}
                      //           textAlign={'center'}
                      //           fontFamily={'AtlantisText'}
                      //         >
                      //           {data.blockRoll === 'Narrator'
                      //             ? data.blockRoll
                      //             : gameInfo?.gameData?.gameNonPlayerName}
                      //         </Text>
                      //       </Box>
                      //       <Box
                      //         display={'flex'}
                      //         position={'fixed'}
                      //         justifyContent={'space-between'}
                      //         w={'75%'}
                      //         bottom={'55px'}
                      //         fontFamily={'AtlantisContent'}
                      //         fontSize={'21px'}
                      //       >
                      //         <TypingEffect text={data?.blockText} speed={50} />
                      //       </Box>
                      //       <Box
                      //         display={'flex'}
                      //         position={'fixed'}
                      //         justifyContent={'space-between'}
                      //         w={'80%'}
                      //         bottom={'0'}
                      //       >
                      //         <Img
                      //           src={preloadedAssets?.left}
                      //           w={'50px'}
                      //           h={'50px'}
                      //           cursor={'pointer'}
                      //         />
                      //         <Img
                      //           src={preloadedAssets?.right}
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
                    {currentTab === 4 && data && type === 'Interaction' && (
                      <Box
                        position="relative"                       
                        w={'100%'}
                        height="100vh"
                        backgroundImage={preloadedAssets?.backgroundImage}
                        backgroundSize={'cover'}
                        backgroundRepeat={'no-repeat'}
                        className="chapter_potrait"
                      >
                        <Grid
                          templateColumns="repeat(1, 1fr)"
                          gap={4}
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          w={'90%'}
                        >
                          <GridItem colSpan={1} position={'relative'}>
                            <Box
                              position={'relative'}
                              className="story_interaction_image"
                            >
                              <Img
                                src={preloadedAssets?.parch}
                                w={'auto'}
                                h={'100%'}
                                loading="lazy"
                              />
                              <Box
                                position={'absolute'}
                                top={{ base: '5%', md: '6%' }}
                                // h={'80% !important'}
                                className="story_interaction_content"
                              >
                                <Box
                                  textAlign={'center'}
                                  display={'flex'}
                                  justifyContent={'center'}
                                  alignItems={'center'}
                                  fontWeight={500}
                                  fontSize={{ md: '3vw', lg: '2.5vw' }}
                                  fontFamily={'AtlantisText'}
                                  lineHeight={1}
                                  w={'100%'}
                                  h={'10%'}
                                  className={'interaction_heading_potrait'}
                                >
                                  <Box w={'80%'} color={'#312821'}>
                                    Interaction{' '}
                                  </Box>
                                </Box>
                                <Box
                                  textAlign={'center'}
                                  h={'25%'}
                                  display={'flex'}
                                  justifyContent={'center'}
                                  alignItems={'center'}
                                  fontWeight={500}
                                  fontFamily={'AtlantisText'}
                                  lineHeight={1}
                                  w={'96%'}
                                  overflowY={'scroll'}
                                  marginTop={'15px'}
                                >
                                  <Box className={'story_intraction_question'}>
                                    {data?.blockText}
                                  </Box>
                                </Box>
                                <Box
                                  mt={'10px'}
                                  w={'100%'}
                                  h={'40%'}
                                  fontWeight={500}
                                  overflowY={'scroll'}
                                  display={'flex'}
                                  justifyContent={'center'}
                                >
                                  <Box w={'60%'}>
                                    {options &&
                                      options.map((item: any, ind: number) => (
                                        <Box
                                          w={'100%'}
                                          mb={'10px'}
                                          lineHeight={1}
                                          key={ind}
                                          color={
                                            selectedOption === ind
                                              ? 'purple'
                                              : ''
                                          }
                                          textAlign={'center'}
                                          cursor={'pointer'}
                                          onClick={() =>
                                            handleValidate(item, ind)
                                          }
                                          fontFamily={'AtlantisText'}
                                        >
                                          <Img
                                            src={
                                              selectedOption === ind
                                                ? preloadedAssets?.on
                                                : preloadedAssets?.off
                                            }
                                            h={'4vh'}
                                            w={'100%'}
                                          />
                                          <Box
                                            className={
                                              'story_interaction_option'
                                            }
                                          >
                                            {item?.qpOptionText}
                                          </Box>
                                        </Box>
                                      ))}
                                  </Box>
                                </Box>
                                <Box
                                  w={'98%'}
                                  display={'flex'}
                                  justifyContent={'space-between'}
                                >
                                  <Img
                                    src={preloadedAssets?.left}
                                    className={'interaction_button'}
                                    // onClick={() => prevData(data)}
                                  />
                                  {selectedOption !== null && (
                                    <Img
                                      src={preloadedAssets?.right}
                                      className={'interaction_button'}
                                      onClick={() => getData(data)}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </GridItem>
                        </Grid>
                      </Box>

                      // old interaction ui copy

                      // <Box
                      //   w={'100%'}
                      //   h={'100vh'}
                      //   display={'flex'}
                      //   alignItems={'center'}
                      //   justifyContent={'center'}
                      //   position={'relative'}
                      // >
                      //   <Img
                      //     src={preloadedAssets?.backgroundImage}
                      //     maxW={'100%'}
                      //     maxH={'100%'}
                      //     w={'100%'}
                      //     h={'100vh'}
                      //     transform={`scale(1.5}) translateY(-10%) translateX(${
                      //       showNote ? -200 : 0
                      //     }px)`}
                      //     transition={'transform 0.9s ease-in-out'}
                      //   />
                      //   <Box
                      //     style={{
                      //       transform: `translateX(${
                      //         showNote ? -200 : 0
                      //       }px) scale(1.2)`,
                      //       transition:
                      //         'transform 0.3s ease-in-out, translateY 0.3s ease-in-out',
                      //     }}
                      //     backgroundImage={preloadedAssets?.parch}
                      //     position={'fixed'}
                      //     w={{ sm: '350px', md: '500px' }}
                      //     h={{ sm: '50vh', md: ' 550px' }}
                      //     // top={'4vh'}
                      //     left={{ sm: '60px', md: '180px' }}
                      //     backgroundSize={'contain'}
                      //     backgroundRepeat={'no-repeat'}
                      //   >
                      //     <Box
                      //       textAlign={'center'}
                      //       h={'100px'}
                      //       display={'flex'}
                      //       justifyContent={'center'}
                      //       alignItems={'center'}
                      //       fontWeight={700}
                      //       fontFamily={'AtlantisText'}
                      //       lineHeight={1}
                      //       w={'100%'}
                      //     >
                      //       <Box w={'50%'} fontSize={'21px'}>
                      //         Here You Can Answer the Interactions...!{' '}
                      //       </Box>
                      //     </Box>
                      //     <Box
                      //       textAlign={'center'}
                      //       h={'100px'}
                      //       display={'flex'}
                      //       justifyContent={'center'}
                      //       alignItems={'center'}
                      //       fontWeight={500}
                      //       fontFamily={'AtlantisText'}
                      //       lineHeight={1}
                      //       w={'96%'}
                      //       overflowY={'scroll'}
                      //     >
                      //       <Box w={'60%'} fontSize={'20px'} letterSpacing={1}>
                      //         {data?.blockText}
                      //       </Box>
                      //     </Box>
                      //     <Box
                      //       mt={'10px'}
                      //       w={{ sm: '200px', md: '400px' }}
                      //       fontWeight={500}
                      //       ml={'17%'}
                      //       h={'220px'}
                      //       overflowY={'scroll'}
                      //     >
                      //       {options &&
                      //         options.map((item: any, ind: number) => (
                      //           <Box
                      //             mb={'10px'}
                      //             w={'80%'}
                      //             lineHeight={1}
                      //             key={ind}
                      //             color={selectedOption === ind ? 'purple' : ''}
                      //             textAlign={'center'}
                      //             cursor={'pointer'}
                      //             onClick={() => handleValidate(item, ind)}
                      //             fontFamily={'AtlantisText'}
                      //             fontSize={'20px'}
                      //           >
                      //             <Img
                      //               src={
                      //                 selectedOption === ind
                      //                   ? preloadedAssets?.on
                      //                   : preloadedAssets?.off
                      //               }
                      //               h={'30px'}
                      //               w={'95%'}
                      //             />
                      //             {item?.qpOptionText}
                      //           </Box>
                      //         ))}
                      //     </Box>
                      //     <Box
                      //       display={'flex'}
                      //       position={'fixed'}
                      //       justifyContent={'space-between'}
                      //       w={'508px'}
                      //       left={'-10px'}
                      //     >
                      //       <Img
                      //         src={preloadedAssets?.left}
                      //         w={'50px'}
                      //         h={'50px'}
                      //         cursor={'pointer'}
                      //       />
                      //       {selectedOption !== null && (
                      //         <Img
                      //           src={preloadedAssets?.right}
                      //           w={'50px'}
                      //           h={'50px'}
                      //           cursor={'pointer'}
                      //           onClick={() => getData(data)}
                      //         />
                      //       )}
                      //     </Box>
                      //   </Box>
                      // </Box>
                    )}
                    {currentTab === 4 && data && type === 'response' && (
                      <Box className="chapter_potrait">
                        <Img
                          src={preloadedAssets?.backgroundImage}
                          className="dialogue_screen"
                        />
                        {/* <Box w={'100%'} h={'100vh'}>
                          <Canvas camera={{ position: [30, 0, 10] }}>
                            <directionalLight
                              position={[5, 5, 5]}
                              intensity={0.8}
                              color={0xffccaa}
                              castShadow
                            />
                            <ambientLight intensity={5.5} />
                            {/* <pointLight position={[5, 5, 5]} color={0xff0000} intensity={1} /> */}
                        {/* <Background /> */}
                        {/* <Model /> */}
                        {/* <mesh 
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, -5, 0]}
                        receiveShadow 
                      > */}
                        {/* <planeGeometry args={[100, 100]} />
                        <shadowMaterial opacity={0.5} />
                      </mesh> */}
                        {/* </Canvas>
                        </Box> */}
                        {/* {selectedPlayer && (
                          <Img
                            src={`${API_SERVER}/${selectedPlayer}`}
                            position={'fixed'}
                            right={'300px'}
                            bottom={'100px'}
                            w={'200px'}
                            h={'324px'}
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
                          />
                        )} */}
                        <Img
                          className={'dialogue_image'}
                          src={preloadedAssets?.dial}
                        />
                        {!showNote && (
                          <>
                            <Box position={'relative'}>
                              <Img
                                src={preloadedAssets?.char}
                                position={'fixed'}
                                h={'100px'}
                                w={'30%'}
                                left={'5%'}
                                bottom={'93px'}
                              />
                              <Text
                                position={'fixed'}
                                left={{ base: '17%', md: '18%' }}
                                bottom={'118px'}
                                fontSize={{ base: '30px', xl: '2.2vw' }}
                                fontWeight={500}
                                textAlign={'center'}
                                fontFamily={'AtlantisText'}
                                color={'#312821'}
                              >
                                {data.blockRoll === 'Narrator'
                                  ? data.blockRoll
                                  : gameInfo?.gameData?.gameNonPlayerName}
                              </Text>
                            </Box>
                            <Box
                              display={'flex'}
                              position={'fixed'}
                              alignItems={'center'}
                              justifyContent={'space-between'}
                              h={'61px'}
                              overflowY={'scroll'}
                              w={'85%'}
                              fontSize={{ base: '30px', lg: '1.8vw' }}
                              bottom={'38px'}
                              fontFamily={'AtlantisContent'}
                            >
                              {showTypingEffect === false ? <TypingEffect
                                text={remainingSentences.toString()}
                                speed={50}
                                setSpeedIsOver={setShowTypingEffect}
                              /> : remainingSentences}
                            </Box>
                            <Box
                              display={'flex'}
                              position={'fixed'}
                              justifyContent={'space-between'}
                              w={'95%'}
                              bottom={'0'}
                            >
                              <Img
                                src={preloadedAssets?.left}
                                w={'70px'}
                                h={'50px'}
                                cursor={'pointer'}
                                //  onClick={() => prevData(data)}
                              />
                              <Img
                                src={preloadedAssets?.right}
                                w={'70px'}
                                h={'50px'}
                                cursor={'pointer'}
                                onClick={() => Updatecontent()}
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
                      //     src={preloadedAssets?.backgroundImage}
                      //     maxW={'100%'}
                      //     maxH={'100%'}
                      //     w={'100%'}
                      //     h={'100vh'}
                      //     transform={
                      //       'scale(1.3}) translateY(-10%) translateX(-10%)'
                      //     }
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
                      //     src={preloadedAssets?.dial}
                      //   />
                      //   {!showNote && (
                      //     <>
                      //       <Box position={'relative'}>
                      //         <Img
                      //           src={preloadedAssets?.char}
                      //           position={'fixed'}
                      //           h={'70px'}
                      //           w={'25%'}
                      //           left={'13%'}
                      //           bottom={'150px'}
                      //         />
                      //         <Text
                      //           position={'fixed'}
                      //           left={'24%'}
                      //           bottom={'167px'}
                      //           fontSize={'25'}
                      //           fontWeight={700}
                      //           textAlign={'center'}
                      //           fontFamily={'AtlantisText'}
                      //         >
                      //           {data.blockRoll === 'Narrator'
                      //             ? data.blockRoll
                      //             : gameInfo?.gameData?.gameNonPlayerName}
                      //         </Text>
                      //       </Box>
                      //       <Box
                      //         display={'flex'}
                      //         position={'fixed'}
                      //         justifyContent={'space-between'}
                      //         w={'75%'}
                      //         bottom={'55px'}
                      //         fontFamily={'AtlantisContent'}
                      //         fontSize={'21px'}
                      //       >
                      //         <TypingEffect text={resMsg} speed={50} />
                      //       </Box>
                      //       <Box
                      //         display={'flex'}
                      //         position={'fixed'}
                      //         justifyContent={'space-between'}
                      //         w={'80%'}
                      //         bottom={'0'}
                      //       >
                      //         <Img
                      //           src={preloadedAssets?.left}
                      //           w={'50px'}
                      //           h={'50px'}
                      //           cursor={'pointer'}
                      //         />
                      //         <Img
                      //           src={preloadedAssets?.right}
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
                    {currentTab === 4 && data && type === 'feedback' && (
                      <Box
                        position="relative"                      
                        w={'100%'}
                        height="100vh"
                        backgroundImage={preloadedAssets?.backgroundImage}
                        backgroundSize={'cover'}
                        backgroundRepeat={'no-repeat'}
                        className="chapter_potrait"
                      >
                        <Grid
                          templateColumns="repeat(1, 1fr)"
                          gap={4}
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          className="story_note_grid"
                        >
                          <GridItem colSpan={1} position={'relative'}>
                            <Box display={'flex'} justifyContent={'center'}>
                              <Img
                                src={preloadedAssets?.feedi}
                                className="story_note_image"
                                loading="lazy"
                              />
                              <Box
                                className={'story_note_content'}
                                // bg={'blue.300'}
                              >
                                <Box
                                  w={'100%'}
                                  display={'flex'}
                                  justifyContent={'center'}
                                >
                                  <Box className={'story_note_block'}>
                                    <Text textAlign={'center'}>{feed}</Text>
                                  </Box>
                                </Box>
                                <Box
                                  w={'100%'}
                                  onClick={() => getData(data)}
                                  mt={'20px'}
                                  display={'flex'}
                                  justifyContent={'center'}
                                  cursor={'pointer'}
                                  position={'fixed'}
                                  top={'70%'}
                                >
                                  <Img
                                    src={preloadedAssets.next}
                                    h={'7vh'}
                                    className={'story_note_next_button'}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </GridItem>
                        </Grid>
                      </Box>
                      // <Box
                      //   w={'100%'}
                      //   h={'100vh'}
                      //   display={'flex'}
                      //   alignItems={'center'}
                      //   justifyContent={'center'}
                      //   position={'relative'}
                      //   overflow={'visible'}
                      //   style={{ perspective: '1000px' }}
                      // >
                      //   <Box
                      //     backgroundImage={preloadedAssets?.backgroundImage}
                      //     w={'100%'}
                      //     h={'100vh'}
                      //     backgroundRepeat={'no-repeat'}
                      //     backgroundSize={'cover'}
                      //     transform={`scale(${first ? 1 : 1.3}) translateY(${
                      //       first ? 0 : -10
                      //     }%) translateX(${first ? 0 : -10}%)`}
                      //     transition={'transform 0.9s ease-in-out'}
                      //   >
                      //     <Box
                      //       position={'fixed'}
                      //       top={'200px'}
                      //       right={'0px'}
                      //       bottom={0}
                      //       zIndex={999}
                      //       w={'300px'}
                      //     ></Box>
                      //   </Box>
                      //   <Box
                      //     style={{
                      //       transform: `scale(${showNote ? 0.2 : 1})`,
                      //       transition: 'transform 0.5s ease-in-out',
                      //     }}
                      //     position={'fixed'}
                      //     w={'40%'}
                      //     h={'auto'}
                      //     display={'flex'}
                      //     flexDirection={'column'}
                      //     justifyContent={'center'}
                      //     alignItems={'center'}
                      //   >
                      //     <Img
                      //       w={'100%'}
                      //       h={'auto'}
                      //       src={preloadedAssets?.feedi}
                      //     />
                      //     <Box
                      //       position={'absolute'}
                      //       w={'75%'}
                      //       mt={'10px'}
                      //       display={'flex'}
                      //       flexDirection={'column'}
                      //       textAlign={'center'}
                      //       justifyContent={'center'}
                      //       style={{
                      //         fontWeight: '900',
                      //         color: '#D9C7A2',
                      //       }}
                      //     >
                      //       {feed}
                      //       <Box
                      //         w={'100%'}
                      //         onClick={() => getData(data)}
                      //         mt={'20px'}
                      //         display={'flex'}
                      //         justifyContent={'center'}
                      //         cursor={'pointer'}
                      //         transform={'translate(0px, 100px)'}
                      //       >
                      //         <Img
                      //           src={preloadedAssets?.next}
                      //           h={'7vh'}
                      //         />
                      //       </Box>
                      //     </Box>
                      //   </Box>
                      // </Box>
                    )}
                    {currentTab === 5 && currentSubTab === 0 && (
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                          backgroundImage={preloadedAssets.backgroundImage}
                        >
                          <Box className="Images">
                            <CompletionContentScreen
                              preview={true}
                              formData={gameInfo.gameData}
                              imageSrc={preloadedAssets.Completion}
                              compliData={gameInfo.completionQuestOptions}
                              CompKeyCount={CompKeyCount}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                    {currentTab === 5 && currentSubTab === 1 && (
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                          backgroundImage={preloadedAssets.backgroundImage}
                        >
                          <Box className="Images">
                            <Box className="LearderBoards">
                              <LeaderBoard
                                formData={gameInfo?.gameData}
                                imageSrc={leaderboard}
                                getData={getData}
                                data={data}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )}
                    {currentTab === 5 && currentSubTab === 2 && (
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box className="Game-Screen">
                          <Box className="Images">
                            <ReflectionContentScreen
                              preview={true}
                              formData={gameInfo.gameData}
                              imageSrc={preloadedAssets?.RefBg}
                              reflectionQuestions={
                                gameInfo?.reflectionQuestions
                              }
                              reflectionQuestionsdefault={
                                reflectionQuestionsdefault
                              }
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                    {currentTab === 5 && currentSubTab === 3 && (
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                          backgroundImage={preloadedAssets.backgroundImage}
                        >
                          <Box className="Images">
                            <TakeAwaysContentScreen
                              preview={true}
                              formData={gameInfo.gameData}
                              imageSrc={preloadedAssets?.Screen4}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                    {currentTab === 5 && currentSubTab === 4 && (
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                          backgroundImage={preloadedAssets.backgroundImage}
                        >
                          <Box className="Images">
                            <WelcomeContentScreen
                              formData={gameInfo.gameData}
                              imageSrc={preloadedAssets?.Screen5}
                              preview={true}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                    {currentTab === 5 && currentSubTab === 5 && (
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                          backgroundImage={preloadedAssets.backgroundImage}
                        >
                          <Box className="Images">
                            <TyContentScreen
                              formData={gameInfo.gameData}
                              imageSrc={preloadedAssets?.Screen6}
                              preview={true}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    <Modal
                      isOpen={endOfQuest}
                      size="full"
                      onClose={handleCloseWindow}
                    >
                      <ModalOverlay />
                      <ModalContent backgroundColor="rgba(0, 0, 0, 0.9)">
                        <ModalCloseButton
                          // zIndex={99999999999}
                          color={'white'}
                        />
                        <ModalBody p={0}>
                          <PreviewEndOfStory
                            setEndOfQuest={setEndOfQuest}
                            preloadedAssets={preloadedAssets}
                            replayQuest={replayQuest}
                          />
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </Flex>
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}
      </Suspense>
    </Box>
  );
};
export default ScreenPreview;
