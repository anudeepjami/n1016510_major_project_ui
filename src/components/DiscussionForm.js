import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';

function DiscussionForm( {discussionFormList, commentDetails, setCommentDetails, SubmitComment} ) {
    return (
        <Card>
            <Card.Header>
                <div className='d-flex justify-content-between'>
                    <h4>Discussion Form for Fundraiser</h4>
                    <div>
                        <span>Overall Rating: </span>
                        <Rating
                            ratingValue={discussionFormList[discussionFormList.length - 1]?.total_rating / discussionFormList.length}
                            readonly={true}
                            size={40}
                        >
                        </Rating>
                    </div>
                </div>
            </Card.Header>
            <br />
            {discussionFormList.map((item, index) => {
                return (
                    <div key={index}>
                        <Card style={{ width: "90%", margin: "0 auto" }}>
                            <Card.Header>
                                <div className='d-flex justify-content-between'>
                                    <b>User: {item.comment_address}</b>
                                    <Rating
                                        ratingValue={parseInt(item.rating)}
                                        readonly={true}
                                        size={30}
                                    >
                                    </Rating>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {item.comment}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <br />
                    </div>
                )
            })
            }
            <Form style={{ width: "90%", margin: "0 auto" }}>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter your comments..!!"
                        onChange={(e) => { setCommentDetails({...commentDetails, comment: e.target.value })}}
                    />
                    <br />
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={commentDetails.commentButtonStatus}
                        onClick={SubmitComment}
                    >
                        Comment
                    </Button>
                    <Rating
                        ratingValue={commentDetails.rating}
                        onClick={(e) => { 
                            console.log(commentDetails);
                            setCommentDetails({...commentDetails, rating: e }) 
                        }}
                    >
                    </Rating>
                    <span> {'<<--'} Please give your star rating here</span>
                </Form.Group>
            </Form>
        </Card>
    )
}

export default DiscussionForm