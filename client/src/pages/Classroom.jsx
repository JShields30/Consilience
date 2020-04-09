import React, { useEffect, useState, useContext } from 'react'
import API from '../utils/API';
import RootContext from '../utils/RootContext';
import ClassBanner from '../components/ClassBanner/ClassBanner';
import Container from '../components/Container/Container';
import Announcement from '../components/AnnouncementForm/Announcement';
import CommentButton from '../components/Comments/CommentButton';
import Expander from '../components/Comments/ExpansionDiv';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
// import { toast, ToastContainer } from 'react-toastify';
// import { ExpansionPanel, ExpansionPanelSummary} from '@material-ui/core'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import ExpansionDiv from '../components/Comments/ExpansionDiv';


const useStyles = makeStyles({
    root: {
        minWidth: 275,
        alignItems: 'center',
        justifyContent: 'center'
    },
    announcementTitle: {
        color: 'black',
        // fontSize: 20
    },
    title: {
        fontSize: 14,
    },
    pos: {
        // marginBottom: 12,
    },
    center: {
        alignItems: 'center',
        // margin: 'auto'
        justifyContent: 'center'
    }
});

export const Classroom = (props) => {

    const classes = useStyles();
    const { classID } = useContext(RootContext);
    // const [setState] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [currentClassObj, setCurrentClassObj] = useState([])
    const [announcementObj, setAnnouncementObj] = useState([])
    const [commentObj, setCommentObj] = useState([])
    const [userType, setUserType] = useState('');
    const [userID, setUserID] = useState('')

    useEffect(() => {
        getAndVerifyUserInfo()
        loadClassInfo()
    }, [userType, userID]);

    async function getAndVerifyUserInfo() {
        try {
            await API.readAndVerifyCookie()
            .then((resp) => {
                console.log("cookie call resp: ", resp)
                console.log("dropping the load: ", resp.data.payload)
                setUserType(resp.data.payload.type)
                setUserID(resp.data.payload._id)
                console.log(userType)
                console.log(userID)
                }
            )
        }
        catch (error) {
            console.log(error)
        }
    }


    function loadClassInfo() {
        API.populateByID(classID)
            .then(resp => {

                console.log(resp.data)
                setCurrentClassObj(resp.data)
                console.log(currentClassObj)
            })
            .catch
            (err => console.log(err))
    }

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        loadClassInfo()
    };

    function handleDialogInputChange(event) {
        const { name, value } = event.target
        setAnnouncementObj({ ...announcementObj, [name]: value })
    }

    function handleDialogSubmit() {
        if (announcementObj.title && announcementObj.body) {
            console.log('Announcement looks good so far')
            API.createAnnouncement(currentClassObj._id, announcementObj)
                .then((resp) => {
                    console.log(resp)
                    loadClassInfo()
                    // currentClassObj.announcements.push(announcementObj)
                })
                .then(() => handleDialogClose())
                // .then(() => setState({ msg: toast.success('announcement created') }))
                .then(() => console.log(announcementObj))
                .catch(err => console.log(err))
        }
    }

    function handleAddComment(event, announcementIndex) {
        event.preventDefault()
        // console.log(event.keyCode);
        // console.log(event.target);
        // console.log(announcementObj);
        const commentInfo = {
            author: userID,
            body: event.target.value.split('\n', 1)[0],
            // announcementID: currentClassObj.announcements[0]._id
        }

        console.log(announcementIndex);
        // console.log(currentClassObj)
        if (event.keyCode === 13) {
            console.log('submitted on enter');
            API.createComment(currentClassObj.announcements[announcementIndex]._id, commentInfo)
                .then(resp => {
                    console.log('got response', resp)
                    
                    // currentClassObj.announcements[announcementIndex].comments.push(commentInfo)
                    loadClassInfo()
                    console.log(resp.data)
                    console.log(commentObj)
                })
                .catch(err => console.log(err))
        }
    }

    // function handleCommentChange(event, announceIndex) {

    //     const commentBody = event.target.value
    //     setAnnouncementObj({ ...commentObj, announceIndex: value })
    // }

    return (
        <div>
            <ClassBanner title={currentClassObj.courseTitle} desc={currentClassObj.courseDescription} />
            <Grid container>
                <Grid item xs={8}>
                    <Container>
                        <Paper elevation={1} square={false}>
                            <Box p={4} alignItems='center' justifyContent='center' display='flex'>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Paper elevation={2}>
                                            <Card>
                                                <CardContent>
                                                    <Typography className={classes.announcementTitle} variant='h3' align='center'>
                                                        ANNOUNCEMENTS BOARD &nbsp; &nbsp;
                                                {userType === 'Teacher' ?
                                                            <Tooltip title="Add an announcement" aria-label="add">
                                                                <Fab size="small" color="primary" aria-label="add">
                                                                    <AddIcon onClick={handleDialogOpen} />
                                                                </Fab>
                                                            </Tooltip> : ''
                                                        }
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Paper>
                                    </Grid>
                                    {/* ---------------------------------------------------------------------- */}
                                    {/* ___________ This is the beginning of the announcment renderings_______ */}
                                    {/* ------------------------------------------------------------------------- */}
                                    {
                                        currentClassObj.announcements ? currentClassObj.announcements.map((announcement, index) => {
                                            return (
                                                <>
                                                    <Grid item xs={12}>
                                                        <Paper elevation={15}>
                                                            <Card className={classes.root} variant="outlined">
                                                                <CardContent key={index}>
                                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                                        {/* {currentClassObj.courseTitle} */}
                                                                    </Typography>
                                                                    <Typography variant="h5" component="h2">
                                                                        {announcement.title}
                                                                    </Typography>
                                                                    <Typography className={classes.pos} color="textSecondary">
                                                                        well shit ...
                                                            </Typography>
                                                                    <Typography variant="body2" component="p">
                                                                        {announcement.body}
                                                                    </Typography>
                                                                </CardContent>
                                                                <CardActions>
                                                                    <Grid container className={classes.center}>
                                                                        <CommentButton /*inputComment={(event) => { handleCommentChange(event, index) }}*/
                                                                            submitComment={(event) => { handleAddComment(event, index) }} />
                                                                    </Grid>
                                                                </CardActions>

                                                                {announcement.comments ?
                                                                    <Expander>
                                                                        {
                                                                            announcement.comments.map((comment, index) => {
                                                                                return (
                                                                                    <>
                                                                                        <Grid item xs={12}>
                                                                                            <Paper key={index} elevation={16}>
                                                                                                <Card>
                                                                                                    <CardContent>
                                                                                                        {comment.body}
                                                                                                    </CardContent>
                                                                                                </Card>
                                                                                            </Paper>
                                                                                        </Grid>
                                                                                    </>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Expander>
                                                                    : ''
                                                                }
                                                            </Card>
                                                        </Paper>
                                                    </Grid>
                                                </>
                                            )
                                        }) :
                                            <Grid item xs={12}>
                                                <Paper elevation={15}>
                                                    <Card className={classes.root} variant="outlined">
                                                        <CardContent>
                                                            <Typography variant="h5" component="h2">
                                                                No announcements at this time
                                                    </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Paper>
                                            </Grid>
                                    }
                                    {/* ------------------------------------------------------------------------- */}
                                    {/* ___________ This is the end of the announcment renderings________________ */}
                                    {/* ------------------------------------------------------------------------- */}
                                </Grid>
                            </Box>
                        </Paper>
                        {/* <ToastContainer /> */}
                    </Container>
                </Grid>
                <Grid item xs={4}>
                    <p>this is where the assignments show-up</p>
                </Grid>
            </Grid>
            {/* ---------------------------------------------------------------------------------------- */}
            {/* _____________The below component renders the dialog to add an announcement______________ */}
            {/* ----------------------------------------------------------------------------------------- */}
            <Announcement
                open={openDialog}
                close={handleDialogClose}
                handleInput={handleDialogInputChange}
                submitDialog={handleDialogSubmit}
            />

        </div >
    );
}

export default Classroom;