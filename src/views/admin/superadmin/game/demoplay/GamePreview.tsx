import { Box, Icon, useToast } from '@chakra-ui/react';

import React, {
  Suspense,
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  lazy,
} from 'react';
import { preloadedImages, preloadedGLBFiles } from 'utils/hooks/function';
import { assetImageSrc } from 'utils/hooks/imageSrc';
import { json, useParams } from 'react-router-dom';
import {
  getGameDemoData,
  SubmitReview,
  getGameCreatorDemoData,
  updatePreviewlogs
} from 'utils/game/gameService';
import { API_SERVER } from 'config/constant';
import { IoIosRefresh } from 'react-icons/io';
import PlayInfo from './playcards/playinfo';
import CharacterGlb from 'assets/img/games/Character_sample.glb';
import Merlin from 'assets/img/games/Merlin.glb';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const EntirePreview = lazy(() => import('./EntirePreview'));
const gameScreens = [
  'Completion',
  'Leaderboard',
  'Reflection',
  'TakeAway',
  'Welcome',
  'ThanksScreen',
];
// const gameScreens = ['GameIntro', "4": 'Welcome', "2": 'Reflection',"1": "Leaderboard", "" : "5": "ThanksScreen", "0": "Completion","3": "TakeAway"];

// const Tab5attribute = [{'attribute': 0,"currentScreenName": "Completion", "currentScreenId": 6} ];
// const Tab5attribute = [6, 4,3, 7, 1,5 ];

export const ScoreContext = createContext<any>(null);

const GamePreview = () => {
  const { uuid } = useParams();
  const { id } = useParams();
  const InitialScreenId = id ? 10 : 1; //replace 10: game Intro, 1: welcome screen by which screen you want to play
  const [gameInfo, setGameInfo] = useState<any | null>(null);
  const [timeout, setTimer] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  // const [currentScreenId, setCurrentScreenId] = useState<number>(InitialScreenId);
  const [profile, setProfile] = useState({
    score: [],
    completedLevels: ['1'],
    currentQuest: 1,
    replayScore:[],
    playerGrandTotal:{questScores:{}},
    todayEarnedScore: [{quest:1, score:0, earnedDate: ""}],  
  });
  const [currentScore, setCurrentScore] = useState(0);
  const toast = useToast();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [contentReady, setContentReady] = useState<boolean>(false);
  const [apiImageSet, setApiImageSet] = useState<any>();
  const [staticAssetImageUrls, setStaticAssetImageUrls] = useState<any>(null);
  const [apiUrlAssetImageUrls, setApiUrlAssetImageUrls] = useState<any>(null); //preloaded Api image urls
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [loadedGLBs, setLoadedGLBs] = useState<any>(null);
  // Newly added start
  const [prevnaviseq, setprevNaviseq] = useState([]);
  const [LastActivityseq, setLastActivityseq] = useState([]);
  const [prevSelectedOptionseq, setprevSelectedOptionseq] = useState([]);
  const [prevScreenId, setprevScreenId] = useState([]);
  const [previewLogsData, setPreviewLogsData] = useState<any>(null);
  const [getPrevLogDatas, setPreLogDatas] = useState({
    previewLogId: '',
    playerId: '',
    playerType: '',
    previewGameId: '',
    nevigatedSeq: [],
    screenIdSeq: [],
    lastActiveBlockSeq: '',
    selectedOptions: '',
    previewProfile: '',
    lastModifiedBlockSeq: '',
    lastBlockModifiedDate:'',
    updatedAt:'',
    playerInputs:'',
    audioVolumeValue:{},
  });
  //End
  const user: any = JSON.parse(localStorage.getItem('user'));
  //get the stored Preview Log Data, if has otherwise create a new record
  const fetchPreviewLogsData = async () => {
    try {
      if (gameInfo?.gameId) {
        const data = {
          previewGameId: gameInfo?.gameId ?? null,
          playerId: gameInfo?.reviewer?.ReviewerId ?? user?.data?.id,
          playerType: gameInfo?.reviewer?.ReviewerId ? 'reviewer' : user?.data?.id ? 'creator' : null
        };
        if (data?.previewGameId === null && data?.playerId === null && data?.playerType === null) {
          console.error('User data not available.');
          return false;
        }
        const userDataString = JSON.stringify(data);
        const updatePreviewLogsResponse = await updatePreviewlogs(userDataString);
        setPreLogDatas({
          previewLogId: updatePreviewLogsResponse.data.previewLogId,
          playerId: updatePreviewLogsResponse.data.playerId,
          playerType: updatePreviewLogsResponse.data.playerType,
          previewGameId: updatePreviewLogsResponse.data.previewGameId,
          nevigatedSeq: updatePreviewLogsResponse.data.nevigatedSeq ? JSON.parse(updatePreviewLogsResponse.data.nevigatedSeq): [],
          screenIdSeq: updatePreviewLogsResponse.data.screenIdSeq ? JSON.parse(updatePreviewLogsResponse.data.screenIdSeq) :[],
          lastActiveBlockSeq: updatePreviewLogsResponse.data.lastActiveBlockSeq ? JSON.parse(updatePreviewLogsResponse.data.lastActiveBlockSeq) :[],
          selectedOptions: updatePreviewLogsResponse.data.selectedOptions ? JSON.parse(updatePreviewLogsResponse.data.selectedOptions) :[],
          previewProfile: updatePreviewLogsResponse.data.previewProfile ? JSON.parse(updatePreviewLogsResponse.data.previewProfile) : [],
          lastModifiedBlockSeq: updatePreviewLogsResponse.data.lastModifiedBlockSeq,
          lastBlockModifiedDate:updatePreviewLogsResponse.data.lastBlockModifiedDate,
          updatedAt:updatePreviewLogsResponse.data.updatedAt,
          playerInputs: updatePreviewLogsResponse.data.playerInputs? JSON.parse(updatePreviewLogsResponse.data.playerInputs) : [],
          audioVolumeValue: updatePreviewLogsResponse.data.audioVolumeValue ? JSON.parse(updatePreviewLogsResponse.data.audioVolumeValue): null
        });
        return updatePreviewLogsResponse;

      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  };
  useEffect(() => {
    const fetchPreviewLogs = async () => {
      const Reponse = await fetchPreviewLogsData();
      if (Reponse) {
        setPreviewLogsData(Reponse);
      }
    }
    fetchPreviewLogs();
  }, [gameInfo]);
  useEffect(() => {
    const fetchPreviewLogs = async () => {
      const Reponse = await fetchPreviewLogsData();
    }

    fetchPreviewLogs();
  }, [previewLogsData]);
//End get the stored Preview Log Data, if has otherwise create a new record

  useEffect(() => {
    const fetchData = async () => {
      // assetImageSrc['characterGlb'] = CharacterGlb;
      const resolvedResult: any = await preloadedImages(assetImageSrc);
      setStaticAssetImageUrls(resolvedResult);
    };

    const loadComponents = async () => {
      // Load all the lazy-loaded components
      await Promise.all([EntirePreview]);
      setComponentsLoaded(true);
    };
    const loadGlbFiles = async () => {
      try {
        // assetImageSrc['characterGlb'] = CharacterGlb;
        // { assetType: 'characterGlb', src: characterGlb },
        // const preloadedGLBs: any = await preloadedGLBFiles([{ assetType: 'characterGlb', src: CharacterGlb }]);
        const preloadedGLBs: any = await preloadedGLBFiles([{ assetType: 'characterGlb', src: Merlin }]);
        // Use preloadedGLBs[CharacterGlb] if you need the preloaded GLB data
        setLoadedGLBs((prev:any)=> ({...prev, preloadedGLBs}))
        const loader = new GLTFLoader();
        const parsedGlbArray = [];
        loader.parse(preloadedGLBs, '', (gltf) => {
          // parsedGlbArray = preloadedGLBs
        });
        // setLoadedGLBs(gltf.scene);
      } catch (error) {
        console.error('Error preloading GLB file:', error);
      }
    };

    fetchData();
    loadGlbFiles();
    loadComponents();
  }, []);


  useEffect(() => {
    uuid && fetchGameData();
  }, [uuid]);
  useEffect(() => {
    id && fetchCreatorDemoData();
    handleFullScreen();
  }, [id]);

  const element = document.getElementById('root');
  const handleFullScreen = () => {
    if (element) {
      try {
        if (document.fullscreenEnabled) {
          if (!document.fullscreenElement) {
            element.requestFullscreen().catch((error) => {
              console.log('Error entering fullscreen mode:', error.message);
            });
          } else {
            console.warn('Document is already in fullscreen mode');
          }
        } else {
          console.error('Fullscreen mode is not supported');
          // Handle scenario where fullscreen mode is not supported by the browser
        }
      } catch (error) {
        console.error('Error requesting fullscreen:', error);
      }
    }
  };

  /*** Collect details of a game based on uuid not gameId
   * This API took gameId based on uuid
   */
  const fetchGameData = async () => {
    const gamedata = await getGameDemoData(uuid);

    if (!gamedata?.error && gamedata) {
      updateGameInfo(gamedata);
    }
  };
  const fetchCreatorDemoData = async () => {
    const gamedata = await getGameCreatorDemoData(id);

    if (!gamedata?.error && gamedata) {
      updateCreatorGameInfo(gamedata);
    }
  };
  const updateCreatorGameInfo = async (info: any) => {
    const {
      gameview,
      image,
      lmsblocks,
      lmsquestionsoptions,
      gameQuest,
      ...gameData
    } = info?.result;
    const sortBlockSequence = (blockArray: []) => {
      const transformedArray = blockArray.reduce((result: any, obj: any) => {
        const groupKey = obj?.blockQuestNo.toString();
        const seqKey = obj?.blockPrimarySequence.toString()?.split('.')[1];
        if (!result[groupKey]) {
          result[groupKey] = {};
        }
        result[groupKey][seqKey] = obj;
        return result;
      }, {});
      return transformedArray;
    };
    const completionScreenData = info?.data;
    const completionOptions = Object.entries(completionScreenData).map((qst: any, i: number) => {
      const item = {
        gameTotalScore:qst[1].gameTotalScore,
        gameId: qst[1].gameId,
        questNo: qst[1].gameQuestNo,
        gameIsSetMinPassScore: qst[1].gameIsSetMinPassScore,
        gameIsSetDistinctionScore: qst[1].gameIsSetDistinctionScore,
        gameDistinctionScore: qst[1].gameDistinctionScore,
        gameIsSetSkillWiseScore: qst[1].gameIsSetSkillWiseScore,
        gameIsSetBadge: qst[1].gameIsSetBadge,
        gameBadge: qst[1].gameBadge,
        gameBadgeName: qst[1].gameBadgeName,
        gameIsSetCriteriaForBadge: qst[1].gameIsSetCriteriaForBadge,
        gameAwardBadgeScore: qst[1].gameAwardBadgeScore,
        gameScreenTitle: qst[1].gameScreenTitle,
        gameIsSetCongratsSingleMessage:
          qst[1].gameIsSetCongratsSingleMessage,
        gameIsSetCongratsScoreWiseMessage:
          qst[1].gameIsSetCongratsScoreWiseMessage,
        gameCompletedCongratsMessage: qst[1].gameCompletedCongratsMessage,
        gameMinimumScoreCongratsMessage:
          qst[1].gameMinimumScoreCongratsMessage,
        gameaboveMinimumScoreCongratsMessage:
          qst[1].gameaboveMinimumScoreCongratsMessage,
        gameLessthanDistinctionScoreCongratsMessage:
          qst[1].gameLessthanDistinctionScoreCongratsMessage,
        gameAboveDistinctionScoreCongratsMessage:
          qst[1].gameAboveDistinctionScoreCongratsMessage,
      };
      return item;
    });
    setGameInfo({
      gameId: info?.result?.gameId,
      gameData: gameData,
      gameHistory: gameview,
      assets: image,
      blocks: sortBlockSequence(lmsblocks),
      gameQuest: gameQuest, //used for completion screen
      completionQuestOptions: completionOptions,
      questOptions: lmsquestionsoptions,
      reflectionQuestions: info?.resultReflection,
      gamePlayers: info?.assets?.playerCharectorsUrl,
      bgMusic:
        info?.assets?.bgMusicUrl && API_SERVER + '/' + info?.assets?.bgMusicUrl,
      gameNonPlayerUrl:
        info?.assets?.npcUrl && API_SERVER + '/' + info?.assets?.npcUrl,
    });
    const apiImageSetArr: any = [
      { assetType: 'backgroundImage', src: image?.gasAssetImage },
      {
        assetType: 'nonplayerImage',
        src: API_SERVER + '/' + info?.assets?.npcUrl,
      },
    ];

    let playerCharectorsUrls = info?.assets?.playerCharectorsUrl.map(
      (item: any, index: number) => {
        let objValue = API_SERVER + '/' + item;
        let objKey = `playerCharacterImage_${index}`;
        apiImageSetArr.push({ assetType: objKey, src: objValue });
      },
    );
    let gameQuestBadges = await Promise.all(
      info?.assets?.badges.map(
        async (item: Record<string, string>) => {
          Object.entries(item).forEach(([key, value]) => {
            let objkeyValue = key.split('_')[1];
            let objKey = `Quest_${objkeyValue}`;
            let objKeyValue = API_SERVER + '/' + value;
            let badgeUrl =  value.split('.');
            const shadowBadgeUrl = badgeUrl[0]+'-shadow.'+badgeUrl[1];
            apiImageSetArr.push({ assetType: objKey, src: objKeyValue });
            apiImageSetArr.push({ assetType: objKey+'-shadow', src: API_SERVER + '/' +shadowBadgeUrl });
          });
          setApiImageSet(apiImageSetArr);
          return true;
        },
      ),
    );
  };

  /** THis function used to update gameInfo state on initial render and after every submition of a review
   *
   * Should update game info after update, delete, new review submition using this function updateGameInfo
   */
  const updateGameInfo = async (info: any) => {
    const {
      gameReviewerId,
      creatorId,
      emailId,
      activeStatus,
      reviews,
      ReviewingCreator,
    } = info?.result?.lmsgamereviewer;
    const {
      gameview,
      image,
      lmsblocks,
      lmsquestionsoptions,
      gameQuest,
      ...gameData
    } = info?.result?.lmsgame;
    const sortBlockSequence = (blockArray: []) => {
      const transformedArray = blockArray.reduce((result: any, obj: any) => {
        const groupKey = obj?.blockQuestNo.toString();
        const seqKey = obj?.blockPrimarySequence.toString()?.split('.')[1];
        if (!result[groupKey]) {
          result[groupKey] = {};
        }
        result[groupKey][seqKey] = obj;
        return result;
      }, {});
      return transformedArray;
    };

    const completionScreenData = info?.data;
    const completionOptions = Object.entries(completionScreenData).map((qst: any, i: number) => {
      const item = {
        gameTotalScore:qst[1].gameTotalScore,
        gameId: qst[1].gameId,
        questNo: qst[1].gameQuestNo,
        gameIsSetMinPassScore: qst[1].gameIsSetMinPassScore,
        gameIsSetDistinctionScore: qst[1].gameIsSetDistinctionScore,
        gameDistinctionScore: qst[1].gameDistinctionScore,
        gameIsSetSkillWiseScore: qst[1].gameIsSetSkillWiseScore,
        gameIsSetBadge: qst[1].gameIsSetBadge,
        gameBadge: qst[1].gameBadge,
        gameBadgeName: qst[1].gameBadgeName,
        gameIsSetCriteriaForBadge: qst[1].gameIsSetCriteriaForBadge,
        gameAwardBadgeScore: qst[1].gameAwardBadgeScore,
        gameScreenTitle: qst[1].gameScreenTitle,
        gameIsSetCongratsSingleMessage:
          qst[1].gameIsSetCongratsSingleMessage,
        gameIsSetCongratsScoreWiseMessage:
          qst[1].gameIsSetCongratsScoreWiseMessage,
        gameCompletedCongratsMessage: qst[1].gameCompletedCongratsMessage,
        gameMinimumScoreCongratsMessage:
          qst[1].gameMinimumScoreCongratsMessage,
        gameaboveMinimumScoreCongratsMessage:
          qst[1].gameaboveMinimumScoreCongratsMessage,
        gameLessthanDistinctionScoreCongratsMessage:
          qst[1].gameLessthanDistinctionScoreCongratsMessage,
        gameAboveDistinctionScoreCongratsMessage:
          qst[1].gameAboveDistinctionScoreCongratsMessage,
      };
      return item;
    });

    setGameInfo({
      gameId: info?.result?.gameId,
      gameData: gameData,
      reviewer: {
        ReviewerId: gameReviewerId,
        ReviewerName:
          ReviewingCreator === null ? null : ReviewingCreator?.ctName,
        ReviewerEmailId: emailId,
        ReviewerGender: ReviewingCreator ? ReviewingCreator?.ctGender : null,
        ReviewerStatus: activeStatus,
        ReviewerDeleteStatus: ReviewingCreator
          ? ReviewingCreator?.ctDeleteStatus
          : null,
      },
      gameQuest: gameQuest, //used for completion screen
      completionQuestOptions: completionOptions,
      reviews: reviews,
      gameHistory: gameview,
      assets: image,
      blocks: sortBlockSequence(lmsblocks),
      questOptions: lmsquestionsoptions,
      reflectionQuestions: info?.resultReflection,
      gamePlayers: info?.assets?.playerCharectorsUrl,
      bgMusic:
        info?.assets?.bgMusicUrl && API_SERVER + '/' + info?.assets?.bgMusicUrl,
      gameNonPlayerUrl:
        info?.assets?.npcUrl && API_SERVER + '/' + info?.assets?.npcUrl,
    });

    const apiImageSetArr: any = [
      { assetType: 'backgroundImage', src: image?.gasAssetImage },
      {
        assetType: 'nonplayerImage',
        src: API_SERVER + '/' + info?.assets?.npcUrl,
      },
    ];

    let playerCharectorsUrls = info?.assets?.playerCharectorsUrl.map(
      (item: any, index: number) => {
        let objValue = API_SERVER + '/' + item;
        let objKey = `playerCharacterImage_${index}`;
        apiImageSetArr.push({ assetType: objKey, src: objValue });
      },
    );
    let gameQuestBadges = await Promise.all(
      info?.assets?.badges.map(
        async (item: Record<string, string>) => {
          Object.entries(item).forEach(([key, value]) => {
            let objkeyValue = key.split('_')[1];
            let objKey = `Quest_${objkeyValue}`;
            let objKeyValue = API_SERVER + '/' + value;
            apiImageSetArr.push({ assetType: objKey, src: objKeyValue });
            let badgeUrl =  value.split('.');
            const shadowBadgeUrl = badgeUrl[0]+'-shadow.'+badgeUrl[1];
            apiImageSetArr.push({ assetType: objKey+'-shadow', src:  API_SERVER + '/' + shadowBadgeUrl });
          });
          setApiImageSet(apiImageSetArr);          
          return true;
        },
      ),
    );
  };

  const handleSubmitReview = async (inputdata: any) => {
    /** Sample post data
   * {"data" :{
    "reviewerId": 4,
    "reviewGameId": 3,
    "review": "Character Tab",
    "tabId": 2,
    "tabAttribute": null,
    "tabAttributeValue": ""
   }
} 
   */
    if (!inputdata.reviewerId || !inputdata.reviewGameId) {
      toast({
        title: 'You are Unauthorized..!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return false;
    } 
    else if (!inputdata.tabId) {
      toast({
        title: 'Select Feedback Options',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return false;
    } else if (!inputdata.review) {
      toast({
        title: 'Review Field is Empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return false;
    }

    const addReviewResponse = await SubmitReview(
      JSON.stringify({ data: inputdata, id: uuid }),
    );
    if (addReviewResponse?.status === 'Failure') {
      toast({
        title: 'Failed to Add Review',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return false;
    }
    if (addReviewResponse?.status === 'Success') {
      toast({
        title: 'Review added Successfully..!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      fetchGameData();
      return true;
    }
  };
  const handleMouseMove = () => {
    setIsHovered(true);
    clearTimeout(timeout);
    setTimer(setTimeout(() => setIsHovered(false), 2000)); // Adjust the timeout duration as needed
  };

  useEffect(() => {
    return () => clearTimeout(timeout); // Cleanup the timer on component unmount
  }, [timeout]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      // const glbAndApiImageSet = {...apiImageSet, glb: CharacterGlb};
      const resolvedResult: any = await preloadedImages(apiImageSet);
      setApiUrlAssetImageUrls(resolvedResult);
    } catch (error) {
      console.error('Error preloading images:', error);
    }
    };
    apiImageSet && fetchData();
  }, [apiImageSet]);

  const preloadedAssets = useMemo(() => {
    return { ...apiUrlAssetImageUrls, ...staticAssetImageUrls, ...loadedGLBs };
  }, [apiUrlAssetImageUrls, staticAssetImageUrls, loadedGLBs]);

  
  useEffect(() => {
    if (
      gameInfo &&
      Object.keys(preloadedAssets).length > 0 &&
      componentsLoaded === true
    ) {
      setContentReady(true);
    } else {
      setContentReady(false);
    }
  }, [gameInfo, preloadedAssets, componentsLoaded]);

  return (
    <>
      <Suspense fallback={<h1>Loading please wait...</h1>}>
        {contentReady && (
          gameInfo?.reviewer?.ReviewerStatus === 'Inactive' ||
            gameInfo?.reviewer?.ReviewerDeleteStatus === 'YES' ? (
            <h1> {'Your are Not Authorized....'}</h1>
          ) : (
            gameInfo?.gameId &&
            (
              (
                <ScoreContext.Provider value={{ profile, setProfile }}>
                  <Box id="container" >
                    {isHovered && (
                      <Icon
                        as={IoIosRefresh}
                        position={'fixed'}
                        top={'20px'}
                        left={'48%'}
                        color={'white'}
                        zIndex={999999}
                        width={'60px'}
                        height={'60px'}
                        padding={'20px'}
                        borderRadius={'50%'}
                        bg={'grey'}
                        cursor={'pointer'}
                        onClick={() => window.location.reload()}
                      />
                    )}
                    <EntirePreview
                      currentScore={currentScore}
                      setCurrentScore={setCurrentScore}
                      //Newly Added states for preview activity track
                      setprevScreenId={setprevScreenId}
                      setPreLogDatas={setPreLogDatas}
                      getPrevLogDatas={getPrevLogDatas}
                      //End - Newly Added states for preview activity track
                      gameInfo={gameInfo}
                      handleSubmitReview={handleSubmitReview}
                      isReviewDemo={id ? false : true}
                      preloadedAssets={preloadedAssets}
                      InitialScreenId={InitialScreenId}
                    />
                  </Box>
                </ScoreContext.Provider>
              ))
          )
        )}
      </Suspense>
    </>
  );
};

export default GamePreview;
