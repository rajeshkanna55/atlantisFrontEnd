// Chakra Imports
import {
  Button,
  Badge,
  Box,
  Flex,
  Icon,
  Text,
  Image,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useBreakpointValue,
  DrawerProps,
  Img,
  Menu,
  MenuButton,
  MenuList,
  FormControl,
  FormLabel,
  Textarea,
  MenuItem,
  Select,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Tooltip,
  GridItem,
  Grid,
  Stack,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';
import SelectField from 'components/fields/SelectField';
import InitialImg from 'assets/img/games/load.jpg';
import { Canvas, useLoader, useFrame } from 'react-three-fiber';
import Sample from 'assets/img/games/Character_sample.glb';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import feedi from 'assets/img/screens/feed.png';
import { AiFillMessage } from 'react-icons/ai';
import Story from './playcards/Story';
import Welcome from './playcards/Welcome';
import ThankYou from './playcards/Thankyou';
import Overview from './playcards/Overview';
import Reflection from './playcards/Reflection';
import Takeway from './playcards/Takeaway';
import Completion from './playcards/Completion';
import ReplayGame from './playcards/ReplayGame';
import { getTestAudios } from 'utils/game/gameService';
import PlayInfo from './playcards/playinfo';
import LeaderBoard from './playcards/Leaderboard';
import { MdClose } from 'react-icons/md';
import ProfileScreen from './playcards/ProfileScreen';
import Characterspage from './playcards/CharacterSelection';
import ChapterPage from './playcards/Chapters';
import FeedBackScreen from './playcards/FeedBackScreen';
import { getVoiceMessage, getPreview } from 'utils/game/gameService';
import { EnumType } from 'typescript';
import { ScoreContext } from './GamePreview';
import Profile from 'assets/img/games/profile.png';
import { FaDesktop, FaMobileAlt } from 'react-icons/fa';
import { IoMdTabletLandscape } from 'react-icons/io';
import VolumeTrack from 'assets/img/games/volume-track.png'
interface Review {
  // reviewId: Number;
  reviewerId: String | null;
  reviewGameId: String | null;
  review: String | null;
  tabId: Number | null;
  tabAttribute: String | null;
  tabAttributeValue: String | null;
}

interface ShowPreviewProps {
  gameScreens: string[];
  currentScreenId: number;
  setCurrentScreenId: React.Dispatch<React.SetStateAction<number>>;
  gameInfo: any;
  handleSubmitReview: (data: any) => Promise<boolean>;
  isReviewDemo: boolean;
  currentScore: any;
  setCurrentScore: any;
  preloadedAssets: any;
}

type TabAttributeSet = {
  [key: string]: {
    tabAttribute: string | null;
    tabAttributeValue: string | null;
  };
};
//no need for story
const overOptions = [
  { value: 1, label: 'Background' },
  { value: 2, label: 'Characters' },
  { value: 3, label: 'Game Overview' },
  { value: 4, label: 'Story' },
  { value: 5, label: 'Design' },
];

const tabOptions = [
  { value: 1, label: 'Background' },
  { value: 2, label: 'Characters' },
  { value: 3, label: 'Game Overview' },
  { value: 4, label: 'Story' },
  { value: 5, label: 'Design' },
];

interface ProfileDataType {
  name?: string;
  gender?: string;
  language?: any;
  // Afrith-modified-starts-07/Mar/24
  score?: any;
  allTimeScore?: any;
  // Afrith-modified-starts-07/Mar/24

  content?: any;
  audioUrls?: any;
  textId?: any;
  fieldName?: any;
}

export const ProfileContext = createContext<ProfileDataType>({
  name: '',
  gender: '',
  language: '',
  score: 350,
  allTimeScore: 950,
});

const EntirePreview: React.FC<ShowPreviewProps> = ({
  gameScreens,
  currentScreenId,
  setCurrentScreenId,
  gameInfo,
  handleSubmitReview,
  isReviewDemo,
  currentScore,
  setCurrentScore,
  preloadedAssets,
}) => {
  console.log('gameInfo', gameInfo)
  const { colorMode, toggleColorMode } = useColorMode();

  const maxTextLength = 80;
  const audioRef = React.useRef(null);
  // const find = show.find((it: any) => it.gasId === formData.gameBackgroundId);
  // const img = find.gasAssetImage;

  // selected option color change
  const [selectedOption, setSelectedOption] = useState(null);
  // handle the item
  const [item, setItem] = useState(null);
  // handle the data to show
  const [data, setData] = useState(null);
  // handle the transition effect
  const [showNote, setShowNote] = useState(false),
    [first, setFirst] = useState(false);
  const [intOpt, setIntOpt] = useState([]);
  // type to render component ( conditional render)
  const [type, setType] = useState<string>('');
  // handle the choosed option's response message and feedback content and navigation
  const [resMsg, setResMsg] = useState<string>('');
  const [feed, setFeed] = useState<string>('');
  const [navi, setNavi] = useState<string>('');
  const [options, setOptions] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [optionNavigation, setOptionNavigation] = useState(null);
  const [getSelectedOptions, SetgetSelectedOptions] = useState({});
  /** This state handles the Review Form Tab and Sub Tab options */
  const [reviewTabOptions, setReviewTabOptions] = useState([]);
  const [questState, setQuestState] = useState({});
  const [filteredTabOptions, setFilteredTabOptions] = useState([]);
  // Feed back after completion
  const [FeedbackcurrentPosition, setFeedbackCurrentPosition] = useState(0);
  const [FeedbackremainingSentences, setFeedbackRemainingSentences] = useState<
    any[]
  >([]);
  const [FeedbackNavigatenext, setFeedbackNavigateNext] = useState<any>(false);
  const [isScreenshot, setisScreenshot] = useState<any>(false);
  const [FeedBackoptionData, setFeedBackoptionData] = useState(null);
  const [FeedBackselectedoptionData, setFeedBackSelectedoptionData] =
    useState(null);
  const [isOptionalReplay, setisOptionalReplay] = useState<any>(false);
  const [isReplay, setisReplay] = useState<any>(false);
  const [profilescore, Setprofilescore] = useState(null);
  const [reviewSubTabOptions, setReviewSubTabOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [reviewInput, setReviewInput] = useState<Review>({
    reviewerId: gameInfo?.reviewer?.ReviewerId ?? null,
    reviewGameId: gameInfo?.gameId ?? null,
    review: '',
    tabId: null,
    tabAttribute: '',
    tabAttributeValue: '',
  });
  const [backgroundScreenUrl, setBackgroundScreenUrl] = useState(null);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [audio, setAudio] = useState<string>('');
  type EnumType = 'bgm' | 'api';
  const [audioObj, setAudioObj] = useState<{
    url: string;
    type: EnumType;
    volume: string;
    loop: boolean;
    autoplay: boolean;
  }>({
    url: '',
    type: 'bgm',
    volume: '0.5',
    loop: true,
    autoplay: true,
  });
  const [audioVolume, setAudioVolume] = useState<any>(0.5);
  const [nextBlockAudioUrl, setNextBlockAudioUrl] = useState<string>('');
  const [windowWidth, setWindowWidth] = useState(null);
  const [windowHeight, setWindowHeight] = useState(null);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [game3Position, setGame3Position] = useState({
    previousBlock: '',
    currentBlock: '',
    nextBlock: '',
  });
  const [currentStoryBlockSeq, setCurrentStoryBlockSeq] =
    useState<string>(null);

  const [demoBlocks, setDemoBlocks] = useState(null);
  const Tab5attribute = [6, 4, 3, 7, 1, 5];
  const userProfile = useContext(ProfileContext);
  const [currentQuestNo, setCurrentQuestNo] = useState(1);
  const [homeLeaderBoard, setHomeLeaderBoard] = useState(null);
  const { profile, setProfile } = useContext(ScoreContext);
  const tabAttributeSets: TabAttributeSet[] = [
    { '1': { tabAttribute: null, tabAttributeValue: null } },
    { '2': { tabAttribute: null, tabAttributeValue: null } },
    { '3': { tabAttribute: 'fieldName', tabAttributeValue: '' } },
    { '4': { tabAttribute: 'blockSeqId', tabAttributeValue: '' } },
    { '5': { tabAttribute: 'screenId', tabAttributeValue: '' } },
  ];
  const [isPrevNavigation, setIsPrevNavigation] = useState(false);
  // Afrith-modified-starts-07/Mar/24
  const gameScore = useContext(ScoreContext);
  const scoreComp = profile?.score[0]?.score ? profile?.score[0]?.score : 0;

  useEffect(() => {
    setProfileData((prev: any) => ({ ...prev, score: scoreComp }));
  }, [scoreComp]);

  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    language: '',
    score: '',
    allTimeScore: 250,
    content: '',
    audioUrls: '',
    textId: '',
    fieldName: '',
    Audiogetlanguage: [],
  });

  // Afrith-modified-ends-07/Mar/24

  const [voiceIds, setVoiceIds] = useState<any>();
  const [feedbackList, setFeedbackList] = useState([]);
  const [interactionCount, setinteractionCount] = useState(null);
  const [isGetsPlayAudioConfirmation, setIsGetsPlayAudioConfirmation] =
    useState<boolean>(false);
  const [reflectionAnswers, setReflectionAnswers] = useState([]);
  const [resolution, setResolution] = useState(null);
  // const [isMobileView, setIsMobileView] = useState(isMobile);
  const [navTrack, setNavTrack] = useState([]);
  const [currentTrackPointer, setCurrentTrackPointer] = useState(0);

  const fetchDefaultBgMusic = async () => {
    const res = await getTestAudios(); //default bg audio fetch
    if (res?.status === 'success' && res?.url)
      setAudioObj({
        url: res?.url,
        type: 'bgm',
        volume: '0.5',
        loop: true,
        autoplay: true,
      });
  };

  useEffect(() => {
    setDemoBlocks(gameInfo?.blocks);
    setType(gameInfo?.blocks[profile?.currentQuest]['1']?.blockChoosen);
    setData(gameInfo?.blocks[profile?.currentQuest]['1']);

    if (
      gameInfo?.blocks[profile?.currentQuest]['1']?.blockChoosen ===
      'Interaction'
    ) {
      const optionsFiltered = [];
      const primarySequence =
        gameInfo.blocks[profile.currentQuest]['1'].blockPrimarySequence;

      for (const option of gameInfo.questOptions) {
        if (option?.qpSequence === primarySequence) {
          optionsFiltered.push(option);
        }
      }
      if (gameInfo?.gameData?.gameShuffle === 'true') {
        for (let i = optionsFiltered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsFiltered[i], optionsFiltered[j]] = [
            optionsFiltered[j],
            optionsFiltered[i],
          ]; // Swap elements at indices i and j
        }
      }
      setOptions(optionsFiltered);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause the audio when the page is hidden
        if (!audioRef.current?.paused) {
          audioRef.current?.pause();
        }
      } else {
        // Resume the audio when the page becomes visible again
        if (audioRef.current?.paused) {
          audioRef.current?.play();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profile?.currentQuest]);

  useEffect(() => {
    if (!gameInfo?.bgMusic) {
      fetchDefaultBgMusic();
    } else if (gameInfo?.bgMusic) {
      currentScreenId > 0 &&
        currentScreenId === 1 &&
        isGetsPlayAudioConfirmation &&
        setAudioObj({
          url: gameInfo?.bgMusic,
          type: 'bgm',
          volume: '0.5',
          loop: true,
          autoplay: true,
        });
    }
  }, [gameInfo]);

  useEffect(() => {
    setAudioObj({
      url: gameInfo?.bgMusic,
      type: 'bgm',
      volume: '0.5',
      loop: true,
      autoplay: true,
    });
  }, [isGetsPlayAudioConfirmation]);

  useEffect(() => {
    setAudioObj({
      url: audio,
      type: 'api',
      volume: '0.5',
      loop: false,
      autoplay: true,
    });
  }, [audio]);

  useEffect(() => {
    // Check if audioRef exists and audioObj.url is not empty
    if (audioRef.current && audioObj.url !== '') {
      // Pause the audio playback if it's currently playing
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      // Update the audio source and play if necessary
      audioRef.current.src = audioObj.url;
      try {
        if (audioObj.autoplay) {
          audioRef.current.play();
        }
      } catch {
        console.log('Error Required');
      }
    } else {
      // Stop the audio playback and set audioRef.current to null
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [audioObj]);

  useEffect(() => {
    if (gameInfo) {
      setVoiceIds({
        narrator:
          gameInfo?.gameData?.gameNarratorVoice ?? 'D38z5RcWu1voky8WS1ja',
        playerMale:
          gameInfo?.gameData?.gamePlayerMaleVoice ?? '2EiwWnXFnvU5JabPnv8n',
        playerFemale:
          gameInfo?.gameData?.gamePlayerFemaleVoice ?? '21m00Tcm4TlvDq8ikWAM',
        NPC: gameInfo?.gameData?.gameNonPlayerVoice ?? '5Q0t7uMcjvnagumLfvZi',
        Intro: '', //Get the intro music for the game.gameBadge(Primary Key)
      });
    }
  }, [gameInfo?.gameData]);

  useEffect(() => {
    currentScreenId > 0 &&
      currentScreenId === 1 &&
      isGetsPlayAudioConfirmation &&
      setAudio(gameInfo?.bgMusic ?? '');
  }, [currentScreenId, gameInfo]);

  const prevData = (current: any) => {
    const quest = current ? current?.blockPrimarySequence.split('.')[0] : null;
    const currentBlock = current
      ? parseInt(current?.blockPrimarySequence.split('.')[1])
      : null;

    navTrack.pop(); //clears last index sequence
    if (navTrack.length > 0) {
      const newTrackSequence = navTrack[navTrack.length - 1];
      const prevBlock = current
        ? Object.keys(demoBlocks[quest] || {})
          .filter(
            (key) =>
              demoBlocks[quest]?.[key]?.blockPrimarySequence ==
              newTrackSequence,
          )
          .map((key: any) => demoBlocks[quest]?.[key])
        : [];

      const currentQuest = current
        ? parseInt(current?.blockPrimarySequence.split('.')[0])
        : null;
      setCurrentQuestNo(currentQuest);
      if (
        prevBlock.length !== 0 &&
        prevBlock[0]?.blockChoosen !== 'Interaction'
      ) {
        /*** Handle the previous track */
        const removedElement = navTrack.pop();
        setNavTrack(navTrack);
        /*** End of Handle the previous track */

        setType(prevBlock[0]?.blockChoosen);
        setData(prevBlock[0]);
        setIsPrevNavigation(true);
        return false;
      }
    } else {
      return false;
    }
  };

  const getData = (next: any) => {
    setIsPrevNavigation(false);
    if (next?.blockChoosen === 'Interaction') {
      const isDuplicate = feedbackList?.some(
        (item: any) =>
          item.Seq === next?.blockPrimarySequence &&
          item.Options === getSelectedOptions,
      );

      if (!isDuplicate) {
        setFeedbackList((prevFeedbackList) => [
          ...prevFeedbackList,
          {
            feedbackcontent: feed,
            Seq: next?.blockPrimarySequence,
            Options: getSelectedOptions,
          },
        ]);
      }
    }

    setAudioObj((prev) => ({ ...prev, url: '', type: 'api', loop: false }));
    const currentBlock = next
      ? parseInt(next?.blockPrimarySequence.split('.')[1])
      : null;

    //get the next block details
    const quest = next ? next?.blockPrimarySequence.split('.')[0] : null;
    const NextItem = currentBlock != null ? currentBlock + 1 : null;

    const nextSeq = next
      ? `${next?.blockPrimarySequence.split('.')[0]}.${NextItem}`
      : '';
    const prevTrack = navTrack;

    const currentQuest = next
      ? parseInt(next?.blockPrimarySequence.split('.')[0])
      : null;
    setCurrentQuestNo(currentQuest);

    setGame3Position((prev: any) => ({
      ...prev,
      previousBlock: next?.blockPrimarySequence,
      currentBlock: nextSeq,
    }));
    const nextLevel = currentQuest != null ? String(currentQuest + 1) : null;
    const nextBlock = next
      ? Object.keys(demoBlocks[quest] || {})
        .filter(
          (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === nextSeq,
        )
        .map((key: any) => demoBlocks[quest]?.[key])
      : [];

    if (nextBlock[0]?.blockChoosen === 'Interaction') {
      const optionsFiltered = [];
      for (const option of gameInfo.questOptions) {
        if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
          optionsFiltered.push(option);
        }
      }
      if (gameInfo?.gameData?.gameShuffle === 'true') {
        for (let i = optionsFiltered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsFiltered[i], optionsFiltered[j]] = [
            optionsFiltered[j],
            optionsFiltered[i],
          ];
        }
      }
      setOptions(optionsFiltered);
    }
    if (type === 'Interaction' && resMsg !== '') {
      setType('response');
      return false;
    } else if (
      (type === 'Interaction' || type === 'response') &&
      feed !== '' &&
      gameInfo?.gameData?.gameIsShowInteractionFeedBack !== 'Completion'
    ) {
      setType('feedback');
      return false;
    } else if (
      type === 'Interaction' ||
      type === 'response' ||
      type === 'feedback'
    ) {
      if (navi === 'Repeat Question') {
        const currentBlockinteraction =
          gameInfo?.blocks[currentQuest][currentBlock];
        setInteractionOptions(gameInfo, currentBlockinteraction);
        setType(next?.blockChoosen);
        setData(next);
        setSelectedOption(null);
        return false;
      } else if (navi === 'New Block') {
        setType(nextBlock[0]?.blockChoosen);
        setData(nextBlock[0]);
        setSelectedOption(null);
        return false;
      } else if (navi === 'Replay Point') {
        setType(demoBlocks[quest]['1']?.blockChoosen);
        setData(demoBlocks[quest]['1']);
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
          if (selectedNext[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (
                option?.qpSequence === selectedNext[0]?.blockPrimarySequence
              ) {
                optionsFiltered.push(option);
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setData(selectedNext && selectedNext[0]);
          setGame3Position((prev: any) => ({
            ...prev,
            nextBlock: nextBlock[0]?.blockPrimarySequence,
          }));
          setSelectedOption(null);
          return false;
        } else {
          setType(nextBlock[0]?.blockChoosen);
          if (nextBlock[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
                optionsFiltered.push(option);
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setData(nextBlock[0]);
          setGame3Position((prev: any) => ({
            ...prev,
            nextBlock: nextBlock[0]?.blockPrimarySequence,
          }));
          setSelectedOption(null);
          return false;
        }
      } else if (navi === 'Complete') {
        if (demoBlocks.hasOwnProperty(nextLevel)) {
          setProfile((prev: any) => {
            const data = { ...prev };
            data.completedLevels = [...data.completedLevels, nextLevel];
            return data;
          });

          setType(demoBlocks[nextLevel]['1']?.blockChoosen);
          setData(demoBlocks[nextLevel]['1']);
          setCurrentScreenId(6);
          return false;
        } else {
          setCurrentScreenId(6);
          setType(null);
          setData(null);
          return false;
        }
      } else {
        setType(nextBlock[0]?.blockChoosen);
        setData(nextBlock[0]);
        setSelectedOption(null);
        return false;
      }
    }

    if (currentScreenId === 6) {
      //Completion
      const {
        currentQuest,
        currentGameData,
        nextLevel,
        haveNextQuest,
        totalScore,
      } = calScore();
      if (gameInfo?.gameData?.gameIsShowInteractionFeedBack === 'Completion') {
        const Completionpage = Object.entries(questState).map(([questId, status]) => ({ questId, status }));
        const OpenStraigntCompletionPage = Completionpage.find((row: any) => row.questId === profile.currentQuest && row.status === 'completed');
        if (OpenStraigntCompletionPage !== undefined) {
          setFeedbackList([]);
          setCurrentScreenId(13);
          return false;
        }
        getFeedbackData(data);
        setFeedbackNavigateNext(false);
        setCurrentScreenId(14); //Navigate to together all feedback
        return false;
      } else if (gameInfo?.gameData?.gameIsShowLeaderboard === 'true') {
        setCurrentScreenId(4); //Navigate to leaderboard
        return false;
      } else if (haveNextQuest) {
        if (currentGameData?.gameIsSetMinPassScore === 'true') {
          const getminpassscore = currentGameData?.gameMinScore;
          const scores = profile?.score;
          const sums: any = {};
          scores.forEach((score: any) => {
            const quest = score.quest;
            if (!sums[quest]) {
              sums[quest] = 0;
            }
            sums[quest] += score.score;
          });

          // const getFinalscores = Object.values(sums);
          const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
            quest,
            score,
          }));
          const getscores = getFinalscores.find(
            (row: any) => row.quest == currentGameData.gameQuestNo,
          );
          const finalscore = getscores?.score;

          if (
            finalscore >= getminpassscore &&
            finalscore < currentGameData?.gameDistinctionScore &&
            gameInfo.gameData?.gameDisableOptionalReplays === 'false'
          ) {
            setCurrentScreenId(8); //Navigate to replaygame prompt screen
            return false;
            //set to prompt it for replay the game
          } else {
            setCurrentScreenId(13); //Navigate to Character Selection screen
            return false;
          }
        } else if (gameInfo.gameData?.gameDisableOptionalReplays === 'false') {
          setCurrentScreenId(8); //Navigate to replaygame prompt screen
          return false;
        }
      } else if (gameInfo.gameData?.gameIsShowReflectionScreen === 'true' && gameInfo?.reflectionQuestions.length > 0) {
        setCurrentScreenId(3); //Navigate to Reflection screen
        return false;
      } else if (gameInfo.gameData?.gameIsShowTakeaway === 'true') {
        setCurrentScreenId(7); //Navigate to takeaway screen
        return false;
      } else {
        setCurrentScreenId(5); //Navigate to Thank you screen
        return false;
      }
      setCurrentScreenId(13); //Navigate Chapter Select page
      return false;
      // }
    }
    if (currentScreenId === 14) {
      const Nextcurrentquest = profile?.currentQuest;
      const getgameinfoquest = gameInfo?.gameQuest.find(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      const haveNextQuest = gameInfo.gameQuest.some(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );

      if (gameInfo?.gameData?.gameIsShowLeaderboard === 'true') {
        setCurrentScreenId(4); //leaderboard
        return false;
      } else if (gameInfo?.gameData?.gameDisableOptionalReplays === 'false') {
        setCurrentScreenId(8); //replay game
        return false;
      } else if (haveNextQuest) {
        if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
          const getminpassscore = getgameinfoquest?.gameMinScore;
          const scores = profile?.score;
          const sums: any = {};
          scores.forEach((score: any) => {
            const quest = score.quest;
            if (!sums[quest]) {
              sums[quest] = 0;
            }
            sums[quest] += score.score;
          });

          const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
            quest,
            score,
          }));
          const getscores = getFinalscores.find(
            (row: any) => row.quest == getgameinfoquest?.gameQuestNo,
          );
          const finalscore = getscores?.score;
          if (
            finalscore >= getminpassscore &&
            finalscore < getgameinfoquest?.gameDistinctionScore &&
            gameInfo.gameData?.gameDisableOptionalReplays === 'false'
          ) {
            setisOptionalReplay(false);
            setisReplay(true);
            Setprofilescore(finalscore);
            setCurrentScreenId(8);
            return false;
          } else {
            setCurrentScreenId(13); //Navigate to Chapter Selection screen
            return false;
          }
        }
      } else if (gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' && gameInfo?.reflectionQuestions.length > 0) {
        setCurrentScreenId(3); //reflection screen
        return false;
      } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
        setCurrentScreenId(7); //takeaway
        return false;
      } else {
        setType(null);
        setData(null);
        setCurrentScreenId(5); //thank you screen
        return false;
      }
    }
    if (currentScreenId === 8) {
      if (gameInfo?.gameData?.gameIsShowLeaderboard === 'true') {
        setCurrentScreenId(4);
        return false;
      } else if (gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' && gameInfo?.reflectionQuestions.length > 0) {
        setCurrentScreenId(3);
        return false;
      } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
        setCurrentScreenId(7);
        return false;
      } else {
        if (data && type) {
          setCurrentScreenId(2);
          return false;
        } else {
          setType(null);
          setData(null);
          setCurrentScreenId(5);
          return false;
        }
      }
    }
    if (currentScreenId === 4) {
      const Nextcurrentquest = profile?.currentQuest;
      const getgameinfoquest = gameInfo?.gameQuest.find(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      const haveNextQuest = gameInfo.gameQuest.some(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      if (haveNextQuest) {
        if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
          const getminpassscore = getgameinfoquest?.gameMinScore;
          const scores = profile?.score;
          const sums: any = {};
          scores.forEach((score: any) => {
            const quest = score.quest;
            if (!sums[quest]) {
              sums[quest] = 0;
            }
            sums[quest] += score.score;
          });

          const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
            quest,
            score,
          }));
          const getscores = getFinalscores.find(
            (row: any) => row.quest == getgameinfoquest.gameQuestNo,
          );
          const finalscore = getscores?.score;
          if (
            finalscore >= getminpassscore &&
            finalscore < getgameinfoquest?.gameDistinctionScore &&
            gameInfo.gameData?.gameDisableOptionalReplays === 'false'
          ) {
            setisOptionalReplay(false);
            setisReplay(true);
            Setprofilescore(finalscore);
            setCurrentScreenId(8);
            return false;
          } else {
            if (data && type) {
              setFeedbackNavigateNext(false);
              setCurrentScreenId(13);
              return false;
            } else {
              if (gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' && gameInfo?.reflectionQuestions.length > 0) {
                setCurrentScreenId(3);
                return false;
              } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
                setCurrentScreenId(7);
                return false;
              } else {
                setType(null);
                setData(null);
                setCurrentScreenId(5);
                return false;
              }
            }
          }
        } else {
          if (data && type) {
            setFeedbackNavigateNext(false);
            setCurrentScreenId(13);
            return false;
          } else {
            if (gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' && gameInfo?.reflectionQuestions.length > 0) {
              setCurrentScreenId(3);
              return false;
            } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
              setCurrentScreenId(7);
              return false;
            } else {
              setType(null);
              setData(null);
              setCurrentScreenId(5);
              return false;
            }
          }
        }
      } else {
        if (data && type) {
          setFeedbackNavigateNext(false);
          setCurrentScreenId(13);
          return false;
        } else {
          if (gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' && gameInfo?.reflectionQuestions.length > 0) {
            setCurrentScreenId(3);
            return false;
          } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
            setCurrentScreenId(7);
            return false;
          } else {
            setType(null);
            setData(null);
            setCurrentScreenId(5);
            return false;
          }
        }
      }
    }
    if (currentScreenId === 7) {
      setCurrentScreenId(5);
      return false;
    }
    if (nextBlock.length === 0) {
      const Nextcurrentquest = next?.blockQuestNo;
      const getgameinfoquest = gameInfo?.gameQuest.find(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
        const getminpassscore = getgameinfoquest?.gameMinScore;
        const scores = profile?.score;
        const sums: any = {};
        scores.forEach((score: any) => {
          const quest = score.quest;
          if (!sums[quest]) {
            sums[quest] = 0;
          }
          sums[quest] += score.score;
        });

        // const getFinalscores = Object.values(sums);
        const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
          quest,
          score,
        }));
        const getscores = getFinalscores.find(
          (row: any) => row.quest == getgameinfoquest.gameQuestNo,
        );
        const finalscore = getscores?.score;
        if (finalscore < getminpassscore) {
          setisReplay(false);
          Setprofilescore(finalscore);
          setisOptionalReplay(true);
          setCurrentScreenId(8);
          return false;
        } else {
          if (demoBlocks.hasOwnProperty(nextLevel)) {
            setProfile((prev: any) => {
              const data = { ...prev };
              data.completedLevels = [...data.completedLevels, nextLevel];
              return data;
            });
            setType(demoBlocks[nextLevel]['1']?.blockChoosen);
            setData(demoBlocks[nextLevel]['1']);
            setCurrentScreenId(6);
            return false;
          } else {
            setType(null);
            setData(null);
            setCurrentScreenId(6);
            return false;
          }
        }
      } else {
        if (demoBlocks.hasOwnProperty(nextLevel)) {
          setProfile((prev: any) => {
            const data = { ...prev };
            data.completedLevels = [...data.completedLevels, nextLevel];
            return data;
          });
          setType(demoBlocks[nextLevel]['1']?.blockChoosen);
          setData(demoBlocks[nextLevel]['1']);
          setCurrentScreenId(6);
          return false;
        } else {
          setType(null);
          setData(null);
          setCurrentScreenId(6);
          return false;
        }
      }
    }
    if (next?.blockShowNavigate) {
      if (next?.blockShowNavigate === 'Repeat Question') {
        setType(next?.blockChoosen);
        setData(next);
        return false;
      } else if (next?.blockShowNavigate === 'New Block') {
        setType(nextBlock[0]?.blockChoosen);
        setData(nextBlock[0]);
        // prevTrack.push(nextBlock[0].blockPrimarySequence);
        // setNavTrack(prevTrack)
        setSelectedOption(null);
        return false;
      } else if (next?.blockShowNavigate === 'Replay Point') {
        setType(demoBlocks['1']['1']?.blockChoosen);
        setData(demoBlocks['1']['1']);
        setSelectedOption(null);
        return false;
      } else if (next?.blockShowNavigate === 'Select Block') {
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
        if (selectedNext.length > 0) {
          setType(selectedNext && selectedNext[0]?.blockChoosen);
          if (selectedNext[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (
                option?.qpSequence === selectedNext[0]?.blockPrimarySequence
              ) {
                optionsFiltered.push(option);
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setData(selectedNext && selectedNext[0]);
        } else {
          setType(nextBlock[0]?.blockChoosen);
          if (nextBlock[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
                optionsFiltered.push(option);
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setData(nextBlock[0]);
        }
        setGame3Position((prev: any) => ({
          ...prev,
          nextBlock: selectedNext[0]?.blockPrimarySequence,
        }));
        setSelectedOption(null);
        return false;
      } else if (next?.blockShowNavigate === 'Complete') {
        if (demoBlocks.hasOwnProperty(nextLevel)) {
          setProfile((prev: any) => {
            const data = { ...prev };
            data.completedLevels = [...data.completedLevels, nextLevel];
            return data;
          });
          setType(demoBlocks[nextLevel]['1']?.blockChoosen);
          setData(demoBlocks[nextLevel]['1']);
          setFeedbackNavigateNext(false);
          setCurrentScreenId(6);
          return false;
        } else {
          setType(null);
          setData(null);
          setCurrentScreenId(6);
          return false;
        }
        /*
        setProfile((prev: any) => {
          const data = { ...prev };
          data.completedLevels = [...data?.completedLevels, nextLevel];
          return data;
        });
        setFeedbackNavigateNext(false);
        setCurrentScreenId(13);
        return false;*/
      }
    }
    setType(nextBlock[0]?.blockChoosen);
    setData(nextBlock[0]);
    setSelectedOption(null);
  };

  const calScore = () => {
    const currentQuest = data?.blockPrimarySequence.split('.')[0] ?? null;
    const currentGameData = gameInfo.gameQuest.find(
      (row: any) => row.gameQuestNo == profile?.currentQuest,
    );
    const nextLevel = currentQuest != null ? String(currentQuest + 1) : null;
    const haveNextQuest = gameInfo.gameQuest.some(
      (row: any) => row.gameQuestNo > profile?.currentQuest,
    );
    const totalScore = profile?.score.forEach((item: any) => {
      if (item && item.marks) {
        return item.marks.reduce((acc: any, mark: any) => acc + mark, 0);
      }
    });
    return {
      currentQuest: currentQuest,
      currentGameData: currentGameData,
      nextLevel: nextLevel,
      haveNextQuest: haveNextQuest,
      totalScore: totalScore,
    };
  };

  let menuBg = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );

  const setInteractionOptions = (gameInfo: any, currentBlock: any) => {
    const optionsFiltered = gameInfo?.questOptions.filter(
      (key: any) => key?.qpSequence === currentBlock?.blockPrimarySequence,
    );
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

  // validate the choosed option
  const handleValidate = (item: any, ind: number) => {
    setCurrentScore(parseInt(item?.qpScore));
    setResMsg(item?.qpResponse);
    setFeed(item?.qpFeedback);
    setNavi(item?.qpNavigateShow);
    setOptionNavigation(item?.qpNextOption);
    setSelectedOption(ind === selectedOption ? null : ind);
    const text = '..Option ' + item.qpOptions + ' -- ' + item.qpOptionText;
    SetgetSelectedOptions({
      options: item.qpOptions,
      optionText: item.qpOptionText,
    });
    const voiceId =
      // data?.blockRoll == '999999'
      //   ? voiceIds.NPC :
      profileData?.gender === 'Male'
        ? voiceIds?.playerMale
        : voiceIds?.playerFemale;
    getAudioForText(text, voiceId);
  };

  useEffect(() => {
    setFeedBackFromValue();
  }, [currentScreenId]);

  const setFeedBackFromValue = () => {
    switch (currentScreenId) {
      case 0:
        setReviewTabOptions([1, 3, 5]); //GameInto screen
        break;
      case 1:
        setReviewTabOptions([1, 3, 5]); //Welcome
        break;
      case 2:
        setReviewTabOptions([1, 2, 4]); //Story
        break;
      case 3:
        setReviewTabOptions([1, 5]); //Reflection
        break;
      case 4:
        setReviewTabOptions([1, 5]); //Leaderboard
        break;
      case 5:
        setReviewTabOptions([1, 5]); //ThanksScreen
        break;
      case 6:
        setReviewTabOptions([1, 5]); //Completion
        break;
      case 7:
        setReviewTabOptions([1, 5]); //TakeAway
        break;
      default:
        setReviewTabOptions([1, 2, 3, 4, 5]); //All
    }
  };

  useEffect(() => {
    if (reviewTabOptions) {
      const filterTabOptionsList = tabOptions.filter((tabOption) =>
        reviewTabOptions.includes(tabOption.value),
      );

      setFilteredTabOptions(filterTabOptionsList);
    }
  }, [reviewTabOptions]);

  const subTabOptionsForTabIds: Array<{
    [key: string]: Array<{ value: string; label: string }> | null;
  }> = [
      { '1': null },
      { '2': null },
      {
        '3': [
          { value: 'Title', label: 'Title' },
          { value: 'Skill', label: 'Skill' },
          { value: 'Storyline', label: 'Storyline' },
          { value: 'Outcomes', label: 'Outcomes' },
          { value: 'Category', label: 'Category' },
          { value: 'Author', label: 'Author' },
        ],
      },
      { '4': null },
      {
        '5': [
          { value: '0', label: 'Completion' },
          { value: '1', label: 'Leaderboard' },
          { value: '2', label: 'Reflection' },
          { value: '3', label: 'Takeaway' },
          { value: '4', label: 'Welcome' },
          { value: '5', label: 'Thanks' },
        ],
      },
    ];
  useEffect(() => {
    if (audioRef.current) {
      if (currentScreenId === 2) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [currentScreenId]);
  useEffect(() => {
    if (reviewInput?.tabId) {
      if (reviewInput?.tabId === 5) {
        setReviewSubTabOptions([]);
        setReviewInput((prev: Review) => ({
          ...prev,
          tabAttribute: 'screenId',
          tabAttributeValue: Tab5attribute.indexOf(
            Number(currentScreenId),
          ).toString(),
        }));
      } else if (reviewInput?.tabId === 4) {
        //for Story Tab
        const blockSeqId = data.blockQuestNo + '@' + data.blockSecondaryId;
        setReviewSubTabOptions([]);
        setReviewInput((prev: Review) => ({
          ...prev,
          tabAttribute: 'blockSeqId',
          tabAttributeValue: blockSeqId,
        }));
      } else {
        const subOptions = subTabOptionsForTabIds.find(
          (item: any) => Object.keys(item)[0] === reviewInput?.tabId.toString(),
        );
        setReviewSubTabOptions(subOptions[reviewInput?.tabId.toString()]);
      }
      /** To hide the sub tab options and set the subtab selection based on the current screen it here */
    }
  }, [reviewInput.tabId]);
  useEffect(() => {
    /**Validate form */
    if (
      reviewInput.reviewGameId &&
      reviewInput.reviewerId &&
      reviewInput.tabId &&
      reviewInput.review
    ) {
      if (reviewInput.tabId === 3 || reviewInput.tabId === 5) {
        if (reviewInput.tabAttribute && reviewInput.tabAttributeValue) {
          setIsFormValid(true);
        } else {
          setIsFormValid(false);
        }
      } else {
        setIsFormValid(true);
      }
    } else {
      setIsFormValid(false);
    }
  }, [reviewInput]);

  const handleClose = () => {
    const element = document.getElementById('container');
    if (element) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          alert(`${err.message}`);
        });
      }
    }
  };

  //no need for story
  const handleTabSelection = (e: any) => {
    e.preventDefault();
    if (e.target.value) {
      setReviewInput((prev: Review) => ({
        ...prev,
        tabId: e.target.value ?? null,
        tabAttribute: '',
        tabAttributeValue: '',
      }));
      setIsMenuOpen(true);
    } else {
      setReviewInput((prev: Review) => ({
        ...prev,
        tabId: selectedOption?.value ? selectedOption?.value : null,
        tabAttribute: '',
        tabAttributeValue: '',
      }));
      setReviewSubTabOptions([]);
    }
  };

  const handleSubTabSelection = (e: any) => {
    const selectedTabFileds = tabAttributeSets.find(
      (item) => Object.keys(item)[0] === reviewInput?.tabId.toString(),
    );
    setReviewInput((prev: Review) => ({
      ...prev,
      tabAttribute: e.target.value
        ? selectedTabFileds[reviewInput?.tabId.toString()]?.tabAttribute
        : null,
      tabAttributeValue: e.target.value ?? null,
    }));
  };

  const handleMenubtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMenuOpen(true);
  };

  // const toast = useToast();
  const handleReview = (e: any) => {
    setReviewInput((prev: Review) => ({ ...prev, review: e.target.value }));
  };
  const resetInputFields = () => {
    setReviewInput((prev) => ({
      ...prev,
      review: '',
      tabId: null,
      tabAttribute: '',
      tabAttributeValue: '',
    }));
  };
  const hanldeSubmit = async (data: any) => {
    const response = handleSubmitReview(data); //returns true or false
    if (response) {
      setIsMenuOpen(false);
      resetInputFields();
    }
  };
  const hanldeClose = () => {
    setIsFormValid(false);
    resetInputFields();
    setIsMenuOpen(false);
  };
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const startDemo = () => {
    onClose1();
    setCurrentScreenId(10);
  };

  const replayGame = () => {
    setType(gameInfo?.blocks['1']['1']?.blockChoosen);
    setData(gameInfo?.blocks['1']['1']);
    setCurrentScreenId(2);
  };
  const replayNextHandler = (data: any) => {
    const currentQuest = data
      ? parseInt(data?.blockPrimarySequence.split('.')[0])
      : null;
    const nextLevel = currentQuest != null ? String(currentQuest + 1) : null;
    if (data && type) {
      setCurrentScreenId(13);
      return false;
    } else {
      if (gameInfo.gameData?.gameIsShowReflectionScreen !== 'false' && gameInfo?.reflectionQuestions.length > 0) {
        setCurrentScreenId(3); //Navigate to Reflection screen
        return false;
      } else if (gameInfo.gameData?.gameIsShowTakeaway !== 'false') {
        setCurrentScreenId(7); //Navigate to Takeaway screen
        return false;
      } else {
        setType(null);
        setData(null);
        setCurrentScreenId(5); //Navigate to Thank you screen
        return false;
      }
    }
  };
  const getAudioForText = async (text: string, voiceId: string) => {
    if (text && voiceId) {
      const send = {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.8,
          similarity_boost: 0.5,
        },
      };

      const data = JSON.stringify(send);
      /** Working API for getting voice for the text */
      const res = await getVoiceMessage(voiceId, data);
      /** Working API for getting voice for the text */
      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.includes('audio/mpeg')) {
        // const blob = new Blob([res], { type: 'audio/mpeg' });
        let blob = await res.blob();
        const audioApiUrl = URL.createObjectURL(blob);
        setAudio(audioApiUrl);
        blob = null;
      } else {
        return console.log('Audio file Missing');
      }
    }
  };

  const handleAudioError = () => {
    console.error(
      'Failed to load video because no supported source was found.',
    );
  };
  const handleOverView = () => {
    setHomeLeaderBoard(currentScreenId);
    setCurrentScreenId(15); //overview Screen
  };

  useEffect(() => {
    const handleResizeWidth = () => setWindowWidth(window.innerWidth);
    const handleResizeHeight = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResizeWidth);
    window.addEventListener('resize', handleResizeHeight);
    return () => {
      window.removeEventListener('resize', handleResizeWidth);
      window.removeEventListener('resize', handleResizeHeight);
    };
  }, []);

  // Afrith-modified-starts-13/Mar/24

  const getCurrentResolution = () => {
    // Logic to get current screen resolution
    // You can use window.innerWidth and window.innerHeight
    // return {
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    // };

    const body = document.getElementById('body');
    body.style.width = `${window.innerWidth}px`;
    body.style.height = `${window.innerHeight}px`;

    return body;
  };
  // const getMobileResolution = () => {

  // };

  const getCurrScreen = (screenType: any) => {
    // Perform any other actions based on the screen type
    if (screenType == 'Desktop') {
      setResolution(getCurrentResolution());
    } else if (screenType == 'Mobile') {
      // getMobileResolution();
      setResolution({ width: 430, height: 932 });
    } else if (screenType == 'Tablet') {
      setResolution({ width: 768, height: 1024 });
    }
  };

  const dontShowTopMenu =
    currentScreenId !== 7 &&
    currentScreenId !== 6 &&
    currentScreenId !== 5 &&
    currentScreenId !== 4 &&
    currentScreenId !== 3 &&
    currentScreenId !== 10;

  useEffect(() => {
    if (FeedbackNavigatenext === true) {
      getData(data);
    }
  }, [FeedbackNavigatenext]);

  useEffect(() => { }, [FeedBackoptionData]);

  const getFeedbackData = (getdata: any) => {
    setisScreenshot(true);
    const groupedFeedback: { [key: string]: any[] } = {};
    feedbackList.forEach((feedback) => {
      if (!(feedback.Seq in groupedFeedback)) {
        groupedFeedback[feedback.Seq] = [];
      }
      groupedFeedback[feedback.Seq].push(feedback);
    });
    const firstPageFeedback: any[] = [];
    Object.keys(groupedFeedback).forEach((seq) => {
      const lastIndex = groupedFeedback[seq].length - 1;
      firstPageFeedback.push(groupedFeedback[seq][lastIndex]);
    });

    let newRemainingSentences;
    if (FeedbackcurrentPosition < firstPageFeedback.length) {
      newRemainingSentences =
        firstPageFeedback[FeedbackcurrentPosition].feedbackcontent;
      // getOption for FeedBack
      const getgameinfoblockchoosen = gameInfo?.blocks[profile?.currentQuest];
      const getArray = [];
      for (const key in getgameinfoblockchoosen) {
        if (getgameinfoblockchoosen[key].blockChoosen === 'Interaction') {
          getArray.push(getgameinfoblockchoosen[key]);
        }
      }

      const GetSeqData = getArray.filter((item: any) => {
        return (
          item?.blockPrimarySequence ===
          firstPageFeedback[FeedbackcurrentPosition].Seq
        );
      });
      const optionsFiltered = gameInfo?.questOptions.filter(
        (key: any) => key?.qpSequence === GetSeqData[0]?.blockPrimarySequence,
      );
      if (gameInfo?.gameData?.gameShuffle === 'true') {
        for (let i = optionsFiltered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsFiltered[i], optionsFiltered[j]] = [
            optionsFiltered[j],
            optionsFiltered[i],
          ];
        }
      }

      const SelectedoptionsFiltered = optionsFiltered.filter(
        (key: any) =>
          key?.qpOptions ==
          firstPageFeedback[FeedbackcurrentPosition].Options['options'],
      );
      const selectoptionfeed = SelectedoptionsFiltered[0].qpOptions
        ? SelectedoptionsFiltered[0].qpOptions
        : 'null';
      setOptions(optionsFiltered);
      setFeedBackSelectedoptionData(selectoptionfeed);
      setFeedBackoptionData(GetSeqData);
      setFeedbackCurrentPosition(FeedbackcurrentPosition + 1);
      setFeedbackRemainingSentences(newRemainingSentences);
    } else {
      setFeedbackList([]);
      setFeedbackCurrentPosition(0);
      setFeedbackNavigateNext(true);
    }
  };

  const handleHome = () => {
    setCurrentScreenId(1);
    return true;
  };

  return (
    <ProfileContext.Provider value={profileData}>
      <Box id="EntirePreview-wrapper">
        <Box className="EntirePreview-content">
          <Box id="container" className="Play-station">
            <Box className="top-menu-home-section">
              {dontShowTopMenu ? (
                <>
                  <Img src={preloadedAssets.TopMenu} className="top-menu-img" />
                  <Tooltip label="Home"
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    background={'transparent'}
                    boxShadow={'unset'}
                    backgroundImage={preloadedAssets.TooltipImg}
                    backgroundRepeat={'no-repeat'}
                    backgroundSize={'contain'}
                    backgroundPosition={'center'}
                    filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                    padding={'10px'}
                    height={'70px'}
                    w={'150px'}
                    fontSize={'29px'}
                    fontFamily={'Atlantis'}
                    color={'#000'}
                    overflow={'hidden'}
                    lineHeight={'25px'}
                  >
                    <Img
                      src={preloadedAssets.home}
                      className={'top-home-menu'}
                      onClick={() => setCurrentScreenId(1)}
                    />
                  </Tooltip>
                  <Tooltip label="Progress"
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    background={'transparent'}
                    boxShadow={'unset'}
                    backgroundImage={preloadedAssets.TooltipImg}
                    backgroundRepeat={'no-repeat'}
                    backgroundSize={'contain'}
                    backgroundPosition={'center'}
                    filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                    padding={'10px'}
                    height={'70px'}
                    w={'150px'}
                    fontSize={'29px'}
                    fontFamily={'Atlantis'}
                    color={'#000'}
                    overflow={'hidden'}
                    lineHeight={'25px'}
                  >

                    <Box className='progress-box'>
                      {/* <Text className='text'>{BlockNo ? Math.floor(progressPercentage) : 0}%</Text> */}
                      <Text className='text'>{true ? Math.floor(50) : 0}%</Text>
                      <Box className='progressing'>
                        {Array.from({ length: Math.floor(50 / 10) }, (_, index) => (
                          <Box key={index} className='level'></Box>
                        ))}
                      </Box>
                    </Box>
                  </Tooltip>
                  <Tooltip label="Overview"
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    background={'transparent'}
                    boxShadow={'unset'}
                    backgroundImage={preloadedAssets.TooltipImg}
                    backgroundRepeat={'no-repeat'}
                    backgroundSize={'contain'}
                    backgroundPosition={'center'}
                    filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                    padding={'10px'}
                    height={'70px'}
                    w={'150px'}
                    fontSize={'29px'}
                    fontFamily={'Atlantis'}
                    color={'#000'}
                    overflow={'hidden'}
                    lineHeight={'25px'}
                  >
                    <Img
                      src={preloadedAssets.Overview}
                      className="overview-img"
                      onClick={handleOverView}
                    />
                  </Tooltip>
                  <Tooltip label="Settings"
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    background={'transparent'}
                    boxShadow={'unset'}
                    backgroundImage={preloadedAssets.TooltipImg}
                    backgroundRepeat={'no-repeat'}
                    backgroundSize={'contain'}
                    backgroundPosition={'center'}
                    filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                    padding={'10px'}
                    height={'70px'}
                    w={'150px'}
                    fontSize={'29px'}
                    fontFamily={'Atlantis'}
                    color={'#000'}
                    overflow={'hidden'}
                    lineHeight={'25px'}
                  >
                    <Img
                      src={preloadedAssets.Setting}
                      className="setting-img"
                      onClick={() => setIsSettingOpen(true)}
                    />
                  </Tooltip>
                  <Box className="score-box">
                    <Text className="text">
                      {(profile &&
                        profile.score &&
                        profile.score.length > 0 &&
                        profile.score.reduce(
                          (accumulator: number, currentValue: any) => {
                            return accumulator + currentValue.score;
                          },
                          0,
                        )) ||
                        0}
                    </Text>
                  </Box>
                </>
              ) : null}

              {/* {permission.setting ? */}
              {isSettingOpen ? (
                <Box className="Setting-box">
                  <Img
                    src={preloadedAssets.SettingPad}
                    className="setting-pad"
                  />
                  <Box className="music-volume volumes">
                    <Slider
                      aria-label="slider-ex-4"
                      defaultValue={30}
                      name="musicVolume"
                    //  onChange={handleMusicVolume} value={rangeValue?.musicVolume}
                    >
                      <SliderTrack
                        className="slider-track"
                        height="15px"
                        borderRadius="80px"
                      >
                        {/* <Img src={VolumeTrack} /> */}
                        <Box position="relative">
                          <Img w={'100%'} h={'auto'} src={VolumeTrack} alt="Volume Track" />
                          <Box
                            position="absolute"
                            top="47%"
                            left="45%"
                            transform="translate(-50%, -50%)"
                            width="86%"
                          >
                            <SliderFilledTrack className="filled-volume" bg="pink.500" />
                          </Box>
                        </Box>
                        {/* <Box w={'100%'} h={'15px'} display={'flex'} justifyContent={'center'}>
                          <Box w={'75%'}>
                            <SliderFilledTrack
                              className="filled-volume"
                              bg="pink.500"
                            />
                          </Box>
                        </Box> */}
                      </SliderTrack>
                      <SliderThumb
                        boxSize={10}
                        background={'transparent'}
                        // left={'calc(100% - 30%)'}
                      >
                        <Img className='slider_thumb' src={preloadedAssets.SliderPointer} />
                      </SliderThumb>
                    </Slider>
                  </Box>
                  <Box className="voice-volume volumes">
                    <Slider
                      aria-label="slider-ex-4"
                      defaultValue={30}
                      name="voiceVolume"
                    // onChange={handleVoiceVolume} value={rangeValue?.voiceVolume}
                    >
                      <SliderTrack
                        className="slider-track"
                        height="15px"
                        borderRadius="80px"
                      >
                         <Box position="relative">
                          <Img w={'100%'} h={'auto'} src={VolumeTrack} alt="Volume Track" />
                          <Box
                            position="absolute"
                            top="47%"
                            left="45%"
                            transform="translate(-50%, -50%)"
                            width="86%"
                          >
                            <SliderFilledTrack className="filled-volume" bg="pink.500" />
                          </Box>
                        </Box>
                        {/* <SliderFilledTrack
                          className="filled-volume"
                          bg="pink.500"
                        /> */}
                      </SliderTrack>
                      <SliderThumb boxSize={9} background={'transparent'}>
                        <Img className='slider_thumb' src={preloadedAssets.SliderPointer} />
                      </SliderThumb>
                    </Slider>
                  </Box>
                  <Box className="btns">
                    <Button
                      className="okay-btn btn"
                      onClick={() => setIsSettingOpen(false)}
                    >
                      <Img src={preloadedAssets.OkayBtn} />
                    </Button>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Box>
          <Flex
            height="100vh"
            className={currentScreenId === 2 || currentScreenId === 15 ? '' : 'EntirePreview'}
          >
            {(() => {
              switch (currentScreenId) {
                case 0:
                  return (
                    <>
                      {
                        <PlayInfo
                          onOpen={onOpen1}
                          onClose={onClose1}
                          isOpen={true}
                          startDemo={startDemo}
                          setIsGetsPlayAudioConfirmation={
                            setIsGetsPlayAudioConfirmation
                          }
                        />
                      }
                    </>
                  );
                case 1:
                  return (
                    <>
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
                          backgroundImage={preloadedAssets.backgroundImage}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images" h={'100vh !important'}>
                            <Welcome
                              intro={audio}
                              setCurrentScreenId={setCurrentScreenId}
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.backgroundImage}
                              screen={preloadedAssets.Screen5}
                              preview={true}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 2:
                  return (
                    <>
                      {data && type && (
                        <Story
                          windowWidth={windowWidth}
                          windowHeight={windowHeight}
                          prevData={prevData}
                          currentScore={currentScore}
                          selectedNpc={gameInfo?.gameNonPlayerUrl}
                          selectedPlayer={selectedPlayer}
                          formData={gameInfo?.gameData}
                          backGroundImg={preloadedAssets.backgroundImage}
                          data={data}
                          type={type}
                          setCurrentScreenId={setCurrentScreenId}
                          handleValidate={handleValidate}
                          resMsg={resMsg}
                          feed={feed}
                          getData={getData}
                          options={options}
                          option={selectedOption}
                          profileData={profileData}
                          setAudio={setAudio}
                          getAudioForText={getAudioForText}
                          voiceIds={voiceIds}
                          setAudioObj={setAudioObj}
                          setIsGetsPlayAudioConfirmation={
                            setIsGetsPlayAudioConfirmation
                          }
                          isGetsPlayAudioConfirmation={
                            isGetsPlayAudioConfirmation
                          }
                          isPrevNavigation={isPrevNavigation}
                          setIsPrevNavigation={setIsPrevNavigation}
                          setNavTrack={setNavTrack}
                          navTrack={navTrack}
                          setCurrentTrackPointer={setCurrentTrackPointer}
                          gameInfo={gameInfo}
                          preloadedAssets={preloadedAssets}
                        />
                      )}
                    </>
                  );
                case 3:
                  return (
                    <>
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
                            <Reflection
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.RefBg}
                              getData={getData}
                              data={data}
                              reflectionQuestions={
                                gameInfo?.reflectionQuestions
                              }
                              gameInfo={gameInfo}
                              setCurrentScreenId={setCurrentScreenId}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 4:
                  return (
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
                        backgroundImage={preloadedAssets.backgroundImage}
                        w={'100% !important'}
                        h={'100vh'}
                        backgroundRepeat={'no-repeat'}
                        backgroundSize={'cover'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        className="Game-Screen"
                      >
                        <Box className="Images" zIndex={99}>
                          <LeaderBoard
                            homeLeaderBoard={homeLeaderBoard}
                            setHomeLeaderBoard={setHomeLeaderBoard}
                            setCurrentScreenId={setCurrentScreenId}
                            formData={gameInfo?.gameData}
                            imageSrc={preloadedAssets.Lead}
                            getData={getData}
                            data={data}
                            gameInfo={gameInfo}
                            preloadedAssets={preloadedAssets}
                          />
                        </Box>
                      </Box>
                    </Box>
                  );
                case 5:
                  return (
                    <>
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
                          backgroundImage={preloadedAssets.backgroundImage}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images">
                            <ThankYou
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.Screen6}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 6:
                  return (
                    <>
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
                          backgroundImage={preloadedAssets.backgroundImage}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images">
                            <Completion
                              questOptions={gameInfo?.questOptions}
                              getData={getData}
                              questState={questState}
                              setQuestState={setQuestState}
                              data={data}
                              setFeedbackNavigateNext={setFeedbackNavigateNext}
                              getFeedbackData={getFeedbackData}
                              gameInfo={gameInfo}
                              setCurrentScreenId={setCurrentScreenId}
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.backgroundImage}
                              screen={preloadedAssets.Screen1}
                              profile={profile}
                              currentQuestNo={currentQuestNo}
                              completionScreenQuestOptions={
                                gameInfo.completionQuestOptions
                              }
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 7:
                  return (
                    <>
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
                          backgroundImage={preloadedAssets.backgroundImage}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images">
                            <Takeway
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.Screen4}
                              getData={getData}
                              data={data}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 8:
                  return (
                    <>
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
                          backgroundImage={preloadedAssets.backgroundImage}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images">
                            <ReplayGame
                              replayGame={replayGame}
                              replayNextHandler={replayNextHandler}
                              type={type}
                              gameInfo={gameInfo}
                              setType={setType}
                              setData={setData}
                              isOptionalReplay={isOptionalReplay}
                              setisOptionalReplay={setisOptionalReplay}
                              setisReplay={setisReplay}
                              profilescore={profilescore}
                              isReplay={isReplay}
                              setCurrentScreenId={setCurrentScreenId}
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.Replay}
                              getData={getData}
                              data={data}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 9:
                  return (
                    <FeedBackScreen
                      backgroundScreenUrl={preloadedAssets.backgroundImage}
                      first={first}
                      showNote={showNote}
                      isScreenshot={isScreenshot}
                      FeedbackremainingSentences={FeedbackremainingSentences}
                      options={options}
                      setisScreenshot={setisScreenshot}
                      FeedBackselectedoptionData={FeedBackselectedoptionData}
                      FeedBackoptionData={FeedBackoptionData}
                      getFeedbackData={getFeedbackData}
                      data={data}
                      feed={feed}
                      currentScreenId={currentScreenId}
                      getData={getData}
                      profile={profile}
                      preloadedAssets={preloadedAssets}
                    />
                  );
                case 10:
                  return (
                    <>
                      <Box
                        position="relative"
                        maxW="100%"
                        w={'100vw'}
                        height="100vh"
                        backgroundImage={preloadedAssets.backgroundImage}
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
                          <GridItem colSpan={1}>
                            <Box
                              display={'flex'}
                              justifyContent={'center'}
                              position={'relative'}
                            >
                              <Img
                                src={preloadedAssets.Login}
                                className={'first_play'}
                              />
                              <Box className={'play_screen_content'}>
                                <Box>
                                  <Box
                                    w={'100%'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                  >
                                    <Text className={'play_screen_heading'}>
                                      Atlantis
                                    </Text>
                                  </Box>
                                </Box>
                                <Box>
                                  <Box
                                    w={'100%'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                  >
                                    <Text className={'play_screen_text'}>
                                      Welcome To
                                    </Text>
                                  </Box>
                                  <Box
                                    w={'100%'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    mb={{ base: 0, lg: 2 }}
                                  >
                                    <Text className={'play_screen_text'}>
                                      The Demo Play
                                    </Text>
                                  </Box>
                                  <Box
                                    w={'100%'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                  >
                                    <Button
                                      w={'90%'}
                                      h={'5vh'}
                                      bg={'none'}
                                      _hover={{ bg: 'none' }}
                                      onClick={() => {
                                        setCurrentScreenId(1);
                                        setIsGetsPlayAudioConfirmation(true);
                                      }}
                                    ></Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </GridItem>
                        </Grid>
                      </Box>
                    </>
                  );
                case 11:
                  return (
                    <>
                      <ProfileScreen
                        imageSrc={preloadedAssets.backgroundImage}
                        setCurrentScreenId={setCurrentScreenId}
                        profileData={profileData}
                        formData={gameInfo?.gameData}
                        setProfileData={setProfileData}
                        preloadedAssets={preloadedAssets}
                      />
                    </>
                  );
                case 12:
                  return (
                    <>
                      <Characterspage
                        profileData={profileData}
                        setProfileData={setProfileData}
                        setSelectedPlayer={setSelectedPlayer}
                        players={gameInfo?.gamePlayers}
                        formData={gameInfo?.gameData}
                        imageSrc={preloadedAssets.backgroundImage}
                        setCurrentScreenId={setCurrentScreenId}
                        demoBlocks={demoBlocks}
                        preloadedAssets={preloadedAssets}
                      />
                    </>
                  );
                case 13:
                  return (
                    <>
                      <ChapterPage
                        setCurrentQuestNo={setCurrentQuestNo}
                        questState={questState}
                        setQuestState={setQuestState}
                        currentQuestNo={currentQuestNo}
                        formData={gameInfo?.gameData}
                        imageSrc={preloadedAssets.backgroundImage}
                        demoBlocks={demoBlocks}
                        questOptions={gameInfo?.questOptions}
                        setCurrentScreenId={setCurrentScreenId}
                        setData={setData}
                        setType={setType}
                        setOptions={setOptions}
                        gameQuest={gameInfo?.gameQuest}
                        setFeedbackList={setFeedbackList}
                        preloadedAssets={preloadedAssets}
                      />
                    </>
                  );
                case 14:
                  return (
                    <FeedBackScreen
                      backgroundScreenUrl={preloadedAssets.backgroundImage}
                      first={first}
                      showNote={showNote}
                      isScreenshot={isScreenshot}
                      FeedbackremainingSentences={FeedbackremainingSentences}
                      setisScreenshot={setisScreenshot}
                      options={options}
                      FeedBackselectedoptionData={FeedBackselectedoptionData}
                      FeedBackoptionData={FeedBackoptionData}
                      getFeedbackData={getFeedbackData}
                      data={data}
                      currentScreenId={currentScreenId}
                      getData={getData}
                      profile={profile}
                      preloadedAssets={preloadedAssets}
                    />
                  );

                case 15:
                  return (
                    <>
                      {/* <Box
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
                          backgroundImage={preloadedAssets.backgroundImage}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images"> */}
                      <Overview
                        formData={gameInfo?.gameData}
                        imageSrc={preloadedAssets.overview}
                        preloadedAssets={preloadedAssets}
                        homeLeaderBoard={homeLeaderBoard}
                        setCurrentScreenId={setCurrentScreenId}
                        backGroundImg={preloadedAssets.backgroundImage}
                      />
                      {/* </Box>
                        </Box>
                      </Box> */}
                    </>
                  );

                default:
                  console.log(
                    'game details of the data',
                    gameInfo?.gameData,
                    currentScreenId,
                  );
                  return <h1>Loading Screen </h1>;
              }
            })()}
          </Flex>

          {isReviewDemo && (
            <Menu isOpen={isMenuOpen}>
              <MenuButton
                p="0px"
                bg={'brandScheme'}
                position={'fixed'}
                bottom={'0'}
                right={'5px'}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleMenubtn(e)
                }
              >
                <Icon
                  as={AiFillMessage}
                  bg={'#3311db'}
                  color={'#fff'}
                  w="70px"
                  h="70px"
                  borderRadius={'50%'}
                  p={'15px'}
                  me="10px"
                />
              </MenuButton>
              {isMenuOpen && (
                <MenuList
                  boxShadow={shadow}
                  p="20px"
                  me={{ base: '30px', md: 'unset' }}
                  borderRadius="20px"
                  bg={menuBg}
                  border="none"
                  mt="10px"
                  minW={{ base: '360px' }}
                  maxW={{ base: '360px', md: 'unset' }}
                >
                  <FormLabel
                    display="flex"
                    ms="10px"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    <Text fontSize="sm" fontWeight="400" ms="2px">
                      {'Feedback Options'}
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </Text>
                  </FormLabel>
                  <Select
                    mb="10px"
                    me="30px"
                    id="tab"
                    name="tab"
                    onChange={handleTabSelection}
                  >
                    <option value={''}>Select</option>
                    {filteredTabOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Select>
                  {reviewInput?.tabId !== null &&
                    reviewInput?.tabId !== undefined &&
                    reviewSubTabOptions?.length > 0 && (
                      <>
                        <FormLabel
                          display="flex"
                          ms="10px"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          <Text fontSize="sm" fontWeight="400" ms="2px">
                            {'Secondary Options'}
                            <Text as="span" color="red.500">
                              *
                            </Text>
                          </Text>
                        </FormLabel>
                        <Select
                          mb="10px"
                          me="30px"
                          id="subtab"
                          name="subtab"
                          onChange={handleSubTabSelection}
                        >
                          <option value={''}>Select</option>
                          {reviewSubTabOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </Select>
                      </>
                    )}
                  <FormControl>
                    <FormLabel fontSize={'sm'} fontWeight={700} pl="4">
                      Feedback
                    </FormLabel>
                    <Textarea
                      resize="none"
                      w="100%"
                      h="200px"
                      border="1px solid #CBD5E0"
                      borderRadius="20px"
                      p="4"
                      placeholder="Please Share your Thoughts..."
                      onChange={handleReview}
                    />
                    <Text
                      color="#CBD5E0"
                      fontSize={{ base: 'sm', '2xl': 'md' }}
                    >
                      {'Maximum of 250 characters...'}
                    </Text>
                  </FormControl>
                  <MenuItem>
                    <Box
                      w={'100%'}
                      display={'flex'}
                      justifyContent={'flex-start'}
                    >
                      <Button
                        bg="#11047a"
                        _hover={{ bg: '#190793' }}
                        color="#fff"
                        h={'46px'}
                        w={'128px'}
                        mr={'33px'}
                        mt={'7px'}
                        onClick={() => hanldeClose()}
                      >
                        close
                      </Button>
                    </Box>

                    <Box
                      w={'100%'}
                      display={'flex'}
                      justifyContent={'flex-end'}
                    >
                      <Button
                        bg="#11047a"
                        _hover={{ bg: '#190793' }}
                        color="#fff"
                        h={'46px'}
                        w={'128px'}
                        mr={'33px'}
                        mt={'7px'}
                        onClick={() => hanldeSubmit(reviewInput)}
                        isDisabled={!isFormValid}
                      >
                        Submit
                      </Button>
                    </Box>
                  </MenuItem>
                </MenuList>
              )}
            </Menu>
          )}
          {audioObj?.url && (
            <audio
              ref={audioRef}
              controls
              style={{ display: 'none' }}
              loop={audioObj?.loop}
              onError={handleAudioError}
            >
              <source src={audioObj?.url} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          )}
        </Box>
      </Box>
    </ProfileContext.Provider>
  );
};

export default EntirePreview;
