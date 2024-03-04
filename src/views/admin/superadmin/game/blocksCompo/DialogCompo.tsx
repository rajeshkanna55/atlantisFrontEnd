import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    Box,
    Text,
    Flex,
    Button,
    Icon,
    List,
    ListItem,
    Img,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Textarea,
} from '@chakra-ui/react' 
import { MdAdd, MdArrowBack, MdArrowForward, MdArrowRight,MdOutlineStickyNote2, MdCloudUpload, MdDelete } from 'react-icons/md';
// import { MdAdd, MdCloudUpload, MdDelete } from 'react-icons/md';
import { BiSolidDuplicate } from "react-icons/bi";
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectField';
import Select from 'react-select';
import Menu from '../components/Navigate'
import { GiConsoleController } from 'react-icons/gi';
import { getBlockData } from 'utils/game/gameService';
import StrightConector from '../components/dragNdrop/strightConector'
import {TbHandClick, TbMessages } from 'react-icons/tb';
interface PropsDialog {
    id?:number,
    language?:any,
    seq?: any,
    index?: number,
    name?: any,
    handleNDI?:any,
    handleInput?: any,
    handleSelect?: any,
    input?: any,
    getSeq?: any,
    duplicateSeq?: any,
    delSeq?: any,
    characterOption?: any,
    dialogOption?: any,
    voicePoseOption?: any,
    animateBtn?: any,
    setAnimateBtn?: any,
    handleDialogEmotion: any,
    handleDialogVoice: any,
    formData: any,
    alphabet: any,
    setNavigation: any,
    handleBlock: any,
    handleSelectBlock: any,
    handleDialogBlockRoll: any,
    items?: any,
    showSelectBlock?: any,
    setSelectBlock?: any,
    validation?: any,
    handleMiniNDI?: any,
    currentseq?:any,
}



const DialogCompo: React.FC<PropsDialog> = ({ id,language,seq, index, name, handleInput, handleSelect, input, getSeq, duplicateSeq, delSeq, characterOption, dialogOption, voicePoseOption, animateBtn, setAnimateBtn, handleDialogEmotion, handleDialogVoice, formData, handleDialogBlockRoll, alphabet, setNavigation, handleBlock, handleSelectBlock, items,handleNDI, showSelectBlock, setSelectBlock, validation, handleMiniNDI,currentseq }) => {
    const textareaRef = useRef(null);
    const selectValue = `Char${[seq.input]}`;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const customButtonStyles = {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '15px',
        borderColor: '#ccc', // Optional: Change border color for disabled state
        borderWidth: '1px', // Add this line to set the border width
        borderStyle: 'solid', // Add this line to set the border style
        cursor: 'not-allowed', // Optional: Change cursor for disabled state
        padding: '5px 10px',
        width: '144px',
        // textAlign: "left",
        outerWidth: '10px',
        outline: 'none',
    };
    const [showLeftButton, setShowLeftButton] = useState(false);
    const customStyles = {
        menuPortal: (base: any) => ({ ...base, zIndex: 9999, }), control: (provided: any, state: any) => ({
            ...provided,
            borderRadius: '15px',
            borderColor: 'inherit',
            background: 'transparent',
            // height: '45px',
            width: '130px',
            padding: '0 !important',
        }),
    }
    const customStylesAnimate = {
        menuPortal: (base: any) => ({ ...base, zIndex: 9999, }), control: (provided: any, state: any) => ({
            ...provided,
            borderRadius: '15px',
            // borderColor: validation.animation && '2px solid red,
            background: 'transparent',
            // height: '45px',
            padding: '0 !important',
            border: validation?.[`dailogAnimation${seq.input}`] && '2px solid red'
        }),
    }
    const emotionsOptions = [
        { value: 'Joy', label: 'Joy', key: 1 },
        { value: 'Sadness', label: 'Sadness', key: 2 },
        { value: 'Anger', label: 'Anger', key: 3 },
        { value: 'Fear', label: 'Fear', key: 4 },
        { value: 'Surprise', label: 'Surprise', key: 5 },
        { value: 'Disgust', label: 'Disgust', key: 6 },
        { value: 'Anticipation', label: 'Anticipation', key: 7 },
        { value: 'Trust', label: 'Trust', key: 8 },
        { value: 'Guilt', label: 'Guilt', key: 9 },
        { value: 'Love', label: 'Love', key: 10 }
    ];
    const options = [
        { value: 999999, label: 'Player' },
        { value: 99999, label: 'Narrator' },
        { value: formData.gameNonPlayingCharacterId, label: formData.gameNonPlayerName }

    ];
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input?.[`Dialog${seq.input}`]?.dialog]);


    const [showcount, setShowcount] = useState<any>('');

    let focusSeqRef: any;
    const justClick = (event: any, seq: any) => {

        if (event.type === 'click') {
            focusSeqRef = document.getElementsByClassName(seq.id);
            const element = focusSeqRef?.[0];

            if (element) {
                element.classList.remove('non-caret');
                element.removeAttribute('readonly');
                element.focus();
                // console.log('event.----------------', element);
            }
        }
    };
    const [matchingBlockContent, setMatchingBlockContent] = useState('');

    useEffect(() => {
      console.log('language', language);
      // Assume you have a function to get the translation ID dynamicallyz
      
      const fetchData = async () => {
        try {
          // Call getBlockData with both game ID and translation ID
          const fetchedBlockData = await getBlockData(id, language);
          console.log("fetchedBlockData", fetchedBlockData.data.blockData);
  
          // Find the block with matching blockPrimarySequence and seq.id
          const matchingBlock = fetchedBlockData.data.blockData.find((block: any) => block.blockPrimarySequence === seq.id);
          console.log("Matching Block Updated1:", matchingBlock);
  
          // Update the state variable with the matching block content
          if (matchingBlock) {
            setMatchingBlockContent(matchingBlock.content);
          }
  
          // Set the block data in the state
          // setBlockData(updatedBlockData);
        } catch (error) {
          console.error("getBlockData Error:", error);
        }
      };
  
      fetchData();
  
    }, [language, id, seq.id]);
  
    const handleMiniNDInewblock = (value?: any,seq?: any, i?: any) => {

        console.log('seqdia', seq, 'i', i, 'value', value);
        handleNDI(value);

        if (value != '') {
            console.log('seqdia', seq, 'i', i, 'value', value);
            handleSelectBlock({ value: currentseq }, currentseq, `Dialog${seq.input}`, `Dialog${seq.input}`);
        }

    }
    const MiniBox3 = (props: { seq?: any, i?: number, name?: any, bodyRef?: any }) => {
        const { seq, i, name, bodyRef } = props;
        return (
            <Box position={'absolute'} background={'#fff'} p={'10px'}  boxShadow={'1px 1px 17px #69627914'} borderRadius={'8px'} zIndex={99} className='MiniShowBox'>
                <List cursor={'pointer'}>
                    <ListItem onClick={() => handleMiniNDInewblock('Note',seq, i, )} p={'10px'} display={'flex'} alignItems={'center'} borderBottom={'2px solid #f1f1f170'}><Icon as={MdOutlineStickyNote2} mr={'10px'} color={'#3311db'} />Note</ListItem>
                    <ListItem onClick={() => handleMiniNDInewblock('Dialog' ,seq, i )} p={'10px'} display={'flex'} alignItems={'center'} borderBottom={'2px solid #f1f1f170'}><Icon as={TbMessages} mr={'10px'} color={'#3311db'} />Dialog</ListItem>
                    <ListItem onClick={() => handleMiniNDInewblock('Interaction',seq, i)} p={'10px'} display={'flex'} alignItems={'center'}><Icon as={TbHandClick} mr={'10px'} color={'#3311db'} />Interaction</ListItem>
                </List>
            </Box>
        )
      }

    console.log('seq123456', seq);
    const handleLeft = () => {
        const container = document.getElementById(seq.id) as HTMLElement | null;
        if (container) {
            console.log('handleLeft - Before:', container.scrollLeft);
            container.scrollLeft -= 500;
            console.log('handleLeft - After:', container.scrollLeft);
            if (container.scrollLeft <= 0) {
                setShowLeftButton(false);
            }
        }
    };

    const handleRight = () => {
        const container = document.getElementById(seq.id);

        if (!container) {
            console.error(`Element with ID ${seq.id} not found.`);
            console.log('Current DOM:', document.body.innerHTML);
            return;
        }

        console.log('handleRight - Before:', container.scrollLeft);
        container.scrollLeft += 200;
        setShowcount(container.scrollLeft + 300);
        console.log('handleRight - After:', container.scrollLeft);

        if (container.scrollLeft > 0) {
            setShowLeftButton(true);
        }
    };






    return (
        <>
            {/* {seq.status == 'no' ? 
            (null) :               */}

            <Flex className='block-compo' mb={'20px'} scrollBehavior={'smooth'} id={`${seq.id}`} padding={'10px 0'} alignItems={'start'} overflowX={'auto'}>
                {/* {showLeftButton && (
                    <Box className='goLeft' display={'flex'} alignItems={'center'} height={'100%'} position={'absolute'} left={0}>
                        <Button onClick={handleLeft} position={'absolute'} left={0} zIndex={9} background={'#0000'} _hover={{ background: '#0000' }} boxShadow={'unset'}>
                            <Icon as={MdArrowBack} color={'#fff'} />
                            <Box content='""' height={'30px'} width={'30px'} borderRadius={'30px'} zIndex={-9} background={'#11047a'} position={'absolute'}></Box>
                        </Button>
                    </Box>
                )} */}
                <Box className='block-action-icons'>
                    <Icon as={MdAdd} fontSize={'18px'} color={'grey'} mr={'10px'} cursor={'pointer'} onClick={() => getSeq(seq, index, name)} />
                    <Icon as={BiSolidDuplicate} fontSize={'18px'} color={'grey'} mr={'10px'} cursor={'pointer'} onClick={() => duplicateSeq(seq, index, name)} />
                    <Icon as={MdDelete} fontSize={'18px'} color={'grey'} cursor={'pointer'} onClick={() => delSeq(seq, index, name)} />
                </Box>
                <Box className='box-block' display={'flex'} w={'100%'} alignItems={'start'}>
                    <Box mr={'10px'} w={'50px'} fontSize={'17px'} color={'#1b2559'} fontWeight={'700'}>{seq.id}</Box>
                    <Box m={'0 10px 10px 0'} w={'150px'}>
                        {/* <Select placeholder={'Character...'} name={`Dialog${seq.input}`} options={characterOption} onChange={(selectedOption, e) => handleSelect(selectedOption, e, 'character')} value={input?.[`Dialog${seq.input}`]?.character} styles={customStyles} /> */}
                        <Select
                            placeholder={'Character...'}
                            id='blockRoll'
                            name={`Dialog${seq.input}`}
                            menuPortalTarget={document.body}
                            styles={customStyles}
                            options={options}
                            value={
                                options.find(
                                    (option) =>
                                        parseInt(input?.[`Dialog${seq.input}`]?.character, 10)
                                            ? option.value == parseInt(input?.[`Dialog${seq.input}`]?.character, 10)
                                            : ''
                                ) || null
                            }
                            isSearchable={true}
                            onChange={(selectedOption: any) => handleDialogBlockRoll(selectedOption, seq.input)}
                        />

                    </Box>
                    <Box m={'0 10px 0px 0'} w={'350px'}>
                        {/* <Select name={`Dialog${seq.input}`} options={dialogOption} onChange={(selectedOption, e) => handleSelect(selectedOption, e, 'animation')} value={input?.[`Dialog${seq.input}`]?.dialog} isMulti={true} /> */}
                        {/* <Textarea placeholder='Dialog' id='Dialog' name={`Dialog${seq.input}`} onChange={handleInput} value={input?.[`Dialog${seq.input}`]?.dialog} borderRadius={'18px'} /> */}
                        <Textarea
                            placeholder='Dialog'
                            id='Dialog'
                            className={`${seq.id}`}
                            name={`Dialog${seq.input}`}
                            onChange={handleInput}
                            onClick={(e) => justClick(e, seq)}
                            value={(language ? matchingBlockContent : input?.[`Dialog${seq.input}`]?.dialog)}
                            // value={input?.[`Dialog${seq.input}`]?.dialog}
                            borderRadius={'18px'}
                            style={{ overflowY: 'hidden', border: validation?.[`Dialog${seq?.input}`] && '2px solid red' }}
                            minHeight="45px"
                            ref={textareaRef} // Add a ref to the textarea
                            _focusVisible={{ borderColor: '#0000', border: '1px solid #e5e5e5', boxShadow: 'unset' }}
                            tabIndex={0}
                            readOnly={true}
                        />
                    </Box>
                    {parseInt(input?.[`Dialog${seq.input}`]?.character, 10) !== 99999 && (
                        <Box mr={'10px'} w={'150px'}>
                            {/* <Select placeholder={'Animate...'} name={`Dialog${seq.input}`} options={dialogOption} onChange={(selectedOption, e) => handleSelect(selectedOption, e, 'animation')} value={input?.[`Dialog${seq.input}`]?.animation} isMulti={true} styles={customStyles} /> */}
                            <Select
                                placeholder={'Animate...'}
                                id='Dialog'
                                name={`Dialog${seq.input}`}
                                menuPortalTarget={document.body}
                                styles={customStylesAnimate}
                                options={emotionsOptions}
                                isSearchable={true}
                                isMulti={true} 
                               

                                value={input?.[`Dialog${seq.input}`]?.animation
                                    ? input?.[`Dialog${seq.input}`]?.animation.split(',').map((value: string) => ({ // Explicitly specify the type as string
                                        value,
                                        label: value,
                                    }))
                                    : []}
                                onChange={(selectedOption: any) => handleDialogEmotion(selectedOption, seq.input)}
                            />

                        </Box>
                    )}
                    <Box className='navigation-icon' mr={'40px'}>

                        <Flex mb={'13px'}>
                            <Box>
                                <Menu
                                    tabState={'leadDialog'}

                                    id={seq.input}
                                    for={`Dialog${seq.input}`}
                                    setNavigation={setNavigation}
                                    handleBlock={handleBlock}
                                    items={items}
                                    seq={seq}
                                />
                            </Box>
                            <Box ml={'4px'} cursor={'pointer'} display={input?.[`Dialog${seq.input}`]?.DialogleadShow ? 'block' : 'none'} style={{width:'170px'}} >
                                {input?.[`Dialog${seq.input}`]?.DialogleadShow === 'New Block' && !input?.[`Dialog${seq.input}`]?.Dialognavigate ? (
                                    // Render content for New Block
                                    <>
                                    <MiniBox3 seq={seq} i={index}  />
                                        {/* <Select
                                            placeholder={'New Blocks...'}
                                            id='Dialog'
                                            name={`Dialog${seq.input}`}
                                            menuPortalTarget={document.body}
                                            styles={customStyles}
                                            options={optionsnewblock}
                                            isSearchable={true}
                                            className='react-select'
                                            value={
                                                showSelectBlock.find(
                                                    (option: any) => option.value === parseInt(input?.[`Dialog${seq.input}`]?.Dialognavigate, 10)
                                                ) || null
                                            }
                                            onChange={(selectedOptions: any) => {
                                                handleMiniNDInewblock(seq, index, selectedOptions.value);
                                            }}
                                            
                                        /> */}
                                    </>
                                ) : input?.[`Dialog${seq.input}`]?.DialogleadShow === 'Select Block' && !input?.[`Dialog${seq.input}`]?.Dialognavigate ? (
                                    // Render select tag for Select Block
                                    <Select
                                        placeholder={'Blocks...'}
                                        id='Dialog'
                                        name={`Dialog${seq.input}`}
                                        menuPortalTarget={document.body}
                                        styles={customStyles}
                                        options={showSelectBlock.filter((option: any) => option.value !== seq.input)}
                                        isSearchable={true}
                                        className='react-select'
                                        value={
                                            showSelectBlock.find(
                                                (option: any) => option.value === parseInt(input?.[`Dialog${seq.input}`]?.Dialognavigate, 10)
                                            ) || null
                                        }
                                        onChange={(e: any) => handleSelectBlock(e, seq.input, `Dialog${seq.input}`, `Dialog${seq.input}`)}
                                    />
                                ) : (
                                    // Render content for the 'else' condition
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <StrightConector
                                                name={
                                                    // input?.[`Dialog${seq.input}`]?.DialogleadShow === 'New Block'
                                                    // ? (
                                                    //     showSelectBlock.find(
                                                    //         (option: any) => option.value == input?.[`Dialog${seq.input}`]?.Dialognavigate
                                                    //     )?.label
                                                    // ) :
                                                    input?.[`Dialog${seq.input}`]?.DialogleadShow === 'New Block' ? (
                                                        (showSelectBlock.find(
                                                          (option: any) => option.value === input?.[`Dialog${seq.input}`]?.Dialognavigate
                                                        )?.label ) === undefined  ? `${(parseFloat(seq.id) + 0.1).toFixed(1)}` : showSelectBlock.find(
                                                          (option: any) => option.value === input?.[`Dialog${seq.input}`]?.Dialognavigate
                                                        )?.label ) :
                                                    input?.[`Dialog${seq.input}`]?.DialogleadShow === 'Select Block'
                                                        ? (
                                                            showSelectBlock.find(
                                                                (option: any) => option.value == input?.[`Dialog${seq.input}`]?.Dialognavigate
                                                            )?.label
                                                        )
                                                        : input?.[`Dialog${seq.input}`]?.Dialognavigate
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                            </Box>
                        </Flex>

                    </Box>
                    {100 < 50 && ( 

                         <Box w={'100px'} mr={'10px'}>
                            {/* <Select placeholder={'Voices...'} name={`Dialog${seq.input}`} options={voicePoseOption} onChange={(selectedOption, e) => handleSelect(selectedOption, e, 'voice')} value={input?.[`Dialog${seq.input}`]?.voice} styles={customStyles} /> */}
                            <Select
                                placeholder={'Voice...'}
                                id='Dialog'
                                name={`Dialog${seq.input}`}
                                menuPortalTarget={document.body}
                                styles={customStyles}
                                options={emotionsOptions}
                                isSearchable={true}

                                value={
                                    emotionsOptions.find(
                                        (option) => option.value === input?.[`Dialog${seq.input}`]?.voice
                                    ) || null
                                }
                                onChange={(selectedOption: any) => handleDialogVoice(selectedOption, seq.input)}
                            />
                        </Box>
                    )}

                    {/* <Button mr={'10px'}  w={'10%'} onClick={()=>setAnimateBtn(!animateBtn)}>Animate</Button> */}
                    {/* <Button onClick={onOpen}>Animate</Button> */}
                    {animateBtn && <Img src='' alt='animate' h={'30px'} w={'30px'} />}
                    {/* <Text w={'40px'} mr={'10px'} color={'#c4c4c4'}>{seq.upNext}</Text> */}
                </Box>
                {/* <Box className='goRight' display={'flex'} alignItems={'center'} height={'100%'} position={'absolute'} right={0}>
                    <Button onClick={handleRight} position={'absolute'} right={0} zIndex={9} background={'#0000'} _hover={{ background: '#0000' }} boxShadow={'unset'}>
                        <Icon as={MdArrowForward} color={'#fff'} />
                        <Box content='""' height={'30px'} width={'30px'} borderRadius={'30px'} zIndex={-9} background={'#11047a'} position={'absolute'}></Box>
                    </Button>
                </Box> */}
            </Flex>
            {/* } */}

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Animation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight='bold' mb='1rem'>
                            Animation Images
                        </Text>
                        { }
                        <Img src='' />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default DialogCompo
