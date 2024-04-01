import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';

// Images
import Background from 'assets/img/games/fristscreenBackground.jpg';
import QueueBackground from 'assets/img/games/Quest_background.png';
import QueueScreen from 'assets/img/games/Queue_screen.png';
import Demo from 'assets/img/games/1700.jpg';
import Lock from 'assets/img/games/lock.png';
import { BiMoney } from 'react-icons/bi';
import { GiCoins } from 'react-icons/gi';
import { ScoreContext } from '../GamePreview';

const ChapterPage: React.FC<{
  formData?: any;
  imageSrc: any;
  questState: any;
  setQuestState: any;
  demoBlocks: any;
  setCurrentScreenId: any;
  questOptions?: any;
  currentQuestNo?: any;
  setCurrentQuestNo?: any;
  gameQuest?: any;
}> = ({
  imageSrc,
  demoBlocks,
  setCurrentScreenId,
  formData,
  questOptions,
  currentQuestNo,
  setCurrentQuestNo,
  gameQuest,
  questState,
  setQuestState
}) => {
    const [questScores, setQuestScores] = useState(null);

    const [AllowedReplayOption, setAllowedReplayOption] = useState(null);

    useEffect(() => {
      const groupedByQuest: any = {};
      questOptions.forEach((item: any) => {
        const questNo = item.qpQuestNo;
        if (!groupedByQuest[questNo]) {
          groupedByQuest[questNo] = [];
        }
        groupedByQuest[questNo].push(item);
      });
      const maxScoresByQuest: any = {};
      for (const questNo in groupedByQuest) {
        const questData = groupedByQuest[questNo];
        const maxScoresBySequence: any = {};

        questData.forEach((item: any) => {
          const sequence = item.qpSequence;
          const score = parseInt(item.qpScore);

          if (
            !maxScoresBySequence[sequence] ||
            score > maxScoresBySequence[sequence]
          ) {
            maxScoresBySequence[sequence] = score;
          }
        });
        const maxScoreForQuest = Object.values(maxScoresBySequence).reduce(
          (acc: any, score: any) => acc + score,
          0,
        );
        maxScoresByQuest[questNo] = maxScoreForQuest;
      }
      setQuestScores(maxScoresByQuest);


    }, []);
    const { profile, setProfile } = useContext(ScoreContext);
    useEffect(() => {
      // if (profile.completedLevels.length !== 0) {
      //   const completedLevels = profile.completedLevels.map(
      //     (item: any) => item,
      //   );
      //   setCompleted(completedLevels);
      // }
      const currentQuest = profile.currentQuest;
      gameQuest.map((item: any, index: number) => {
        const questNoAsString = item.gameQuestNo.toString();
        if (profile.completedLevels.includes(questNoAsString)) {
          if (formData?.gameDisableOptionalReplays === 'false') {
            if (item?.gameIsSetMinPassScore === 'true') {

              const getminpassscore = item?.gameMinScore;
              const scores = profile?.score;

              const sums: any = {};
              scores.forEach((score: any) => {
                const quest = score.quest;
                if (!sums[quest]) {
                  sums[quest] = 0;
                }
                sums[quest] += score.score;
              });
              const getFinalscores = Object.entries(sums).map(([quest, score]) => ({ quest, score }));
              const getscores = getFinalscores.find((row: any) => row.quest == item.gameQuestNo);
              const finalscore = getscores?.score;
              if (finalscore >= getminpassscore && finalscore < item?.gameDistinctionScore) {

                setQuestState((prevquestdataList: any) => ({
                  ...prevquestdataList,
                  [item.gameQuestNo]: 'replayallowed'

                }));

              } else {
                setQuestState((prevquestdataList: any) => ({
                  ...prevquestdataList,
                  [item.gameQuestNo]: 'Started'

                }));
              }
            }
            else {
              setQuestState((prevquestdataList: any) => ({
                ...prevquestdataList,
                [item.gameQuestNo]: 'replayallowed'

              }));

            }
          }
          else {

            const scores = profile?.score;

            const sums: any = {};
            scores.forEach((score: any) => {
              const quest = score.quest;
              if (!sums[quest]) {
                sums[quest] = 0;
              }
              sums[quest] += score.score;
            });
            const getFinalscores = Object.entries(sums).map(([quest, score]) => ({ quest, score }));
            const getscores = getFinalscores.find((row: any) => row.quest == item.gameQuestNo);
            const finalscore = getscores?.score;
            if (finalscore !== undefined) {
              setQuestState((prevquestdataList: any) => ({
                ...prevquestdataList,
                [item.gameQuestNo]: 'completed'

              }));

            }
            else {
              setQuestState((prevquestdataList: any) => ({
                ...prevquestdataList,
                [item.gameQuestNo]: 'Started'

              }));
            }

          }
        }
        else {

          setQuestState((prevquestdataList: any) => ({
            ...prevquestdataList,
            [item.gameQuestNo]: 'locked'

          }));
        }
      });




    }, [profile]);

    const handleChapter = (it: any) => {
      const Completionpage = Object.entries(questState).map(([questId, status]) => ({ questId, status }));
      const OpenStraigntCompletionPage = Completionpage.find((row: any) => row.questId === it && row.status === 'completed');

      if (OpenStraigntCompletionPage !== undefined) {
        setCurrentScreenId(6);
        setProfile((prev: any) => ({
          ...prev,
          currentQuest: it,
        }));
      }
      else {
        if (profile.completedLevels.includes(it)) {
          setCurrentScreenId(1);
          setProfile((prev: any) => ({
            ...prev,
            currentQuest: it,
          }));
        }

      }


    };


    const container = {
      hidden: { opacity: 1, scale: 0 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          delayChildren: 0.5,
          staggerChildren: 1,
        },
      },
    };

    const item = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
      },
    };
    return (
      <>
        <Box
          position="relative"
          maxW="100%"
          w={'100vw'}
          height="100vh"
          backgroundImage={imageSrc}
          backgroundSize={'cover'}
          backgroundRepeat={'no-repeat'}
          className='chapter_potrait'
        >
          <Grid
            templateColumns="repeat(1, 1fr)"
            gap={4}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="75%"
          >
            <GridItem colSpan={1} position={'relative'}>
              <Img
                src={QueueBackground}
                h={'auto'}
                maxW={'100%'}
                loading="lazy"
              />
              <Box
                className={'chapters_list_box'}

              >
                <Box w={'90%'}>
                  <motion.div
                    className="container"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                  >
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={2}>
                      {demoBlocks &&
                        Object.keys(demoBlocks).map((it: any, num: number) => {
                          return (
                            <motion.div
                              key={num}
                              className="item"
                              variants={item}
                            >
                              <Box
                                position={'relative'}
                                onClick={() => handleChapter(it)}
                              >
                                <Img src={Demo} width={'98%'} />
                                <Img
                                  className="queue-screen"
                                  position={'absolute'}
                                  left={'-2px'}
                                  top={'-2px'}
                                  src={QueueScreen}
                                  zIndex={999}
                                />
                                <Box w={'100%'} position={'absolute'} top={'0'}>
                                  <Text
                                    textAlign={'center'}
                                    right={'65px'}
                                    fontFamily={'AtlantisText'}
                                    color={'#D9C7A2'}
                                    zIndex={999999}
                                  >
                                    Quest {num + 1}
                                  </Text>
                                </Box>
                                <Box
                                  w={'100%'}
                                  position={'absolute'}
                                  bottom={'0'}
                                  color={'#D9C7A2'}
                                  fontFamily={'AtlantisText'}
                                  zIndex={999999}
                                >
                                  <Text
                                    className="amount-score"
                                    textAlign={'center'}
                                  >
                                    {(profile &&
                                      profile.score &&
                                      profile.score.length > 0 &&
                                      profile.score.reduce(
                                        (
                                          accumulator: number,
                                          currentValue: any,
                                        ) => {
                                          return currentValue.quest ===
                                            parseInt(it)
                                            ? accumulator + currentValue.score
                                            : accumulator;
                                        },
                                        0,
                                      )) ||
                                      0}
                                    /{questScores && questScores[it]}{' '}
                                    <Icon as={BiMoney} />
                                  </Text>
                                </Box>

                                {profile.completedLevels.includes(it) ?
                                  Object.entries(questState).map(([questId, status], index) => (
                                    questId === it && status === 'completed' ?
                                      (<Img key={index} src={Lock} className="lock" width={'97%'} position={'absolute'} bg={'#2b2828d6'} top={'0'} />)
                                      : questId === it && status === 'replayallowed' ? null : questId === it && status === 'locked' ? (
                                        <Img key={index} src={Lock} className="lock" width={'97%'} position={'absolute'} bg={'#2b2828d6'} top={'0'} />
                                      ) : questId === it && status === 'Started' ? null : null
                                  )) : (
                                    <Img src={Lock} className="lock" width={'97%'} position={'absolute'} bg={'#2b2828d6'} top={'0'} />
                                  )}


                              </Box>
                            </motion.div>
                          );
                        })}
                    </SimpleGrid>
                  </motion.div>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </>
    );
  };

export default ChapterPage;
