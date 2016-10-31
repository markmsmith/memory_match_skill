import index from '../src/index';
import sinon from 'sinon';

suite('index.js', function(){

    const EXPECTED_START_GAME_RESPONSE = {
        'outputSpeech': {
            'type': 'PlainText',
            'text': "Let's play a game of memory. You have a set of face down cards laid out in 4 rows and 3 columns. You tell me which card to flip over by saying something like, row 4, column 3, or just, 4, 3. You win when you match all 6 pairs. You can stop at any time by saying, exit. You can start a new game by saying, new game."
        },
        'shouldEndSession': false,
        'reprompt': {
            'outputSpeech': {
                'type': 'PlainText',
                'text': 'You can start guessing by saying, row 1, column 1, or exit to stop playing.'
            }
        },
        'card': {
            'type': 'Simple',
            'title': 'Memory Match',
            'content': "Let's play a game of memory. You have a set of face down cards laid out in 4 rows and 3 columns. You tell me which card to flip over by saying something like, row 4, column 3, or just, 4, 3. You win when you match all 6 pairs. You can stop at any time by saying, exit. You can start a new game by saying, new game."
        }
    };

    let launchRequest;
    let mockContext;
    let callbackSpy;
    setup(function(){

        launchRequest = {
            'session': {
                'new': true,
                'sessionId': 'session1234',
                'attributes': {},
                'user': {
                    'userId': null
                },
                'application': {
                    'applicationId': 'amzn1.ask.skill.a224d45d-3af6-42ab-a6d5-6f6d029d7932'
                }
            },
            'version': '1.0',
            'request': {
                'type': 'LaunchRequest',
                'requestId': 'request5678'
            }
        };

        mockContext = {
            fail: sinon.spy(),
            succeed: sinon.spy()
        };
        callbackSpy = sinon.spy();
    });

    test('it should respond to a session start intent', function(){
        index(launchRequest, mockContext, callbackSpy);

        mockContext.succeed.should.be.calledOnce;
        var result = mockContext.succeed.getCall(0).args[0];
        result.response.should.eql(EXPECTED_START_GAME_RESPONSE);
    });

    test('it should respond to a StartGameIntent', function(){
        const startGameRequest = {
            'session': {
                'sessionId': 'SessionId.01540968-4cbc-4a92-a269-ebdde7a01379',
                'application': {
                    'applicationId': 'amzn1.ask.skill.a224d45d-3af6-42ab-a6d5-6f6d029d7932'
                },
                'attributes': {},
                'user': {
                    'userId': 'amzn1.ask.account.AFWDXWUEUYBQPDHYHZPUANTX2KKMVQQC4LNTA24AZ4AJFQV4TAXCROGTQX5JNUEEQUAD' +
                        'CLGV6P74TKFVUH4DUEGJNLHFYS7CKXY5UBEB5VRYPVTQFJU76ZDF2C3PAV5KSJMDZDNAKF2FON2N3XMILOD56UGLYJWU' +
                        '2PN7QJFOCRVJTABK4I5TTGBNFYSBAKSZIPMVNQXKJUQBCFI'
                },
                'new': true
            },
            'request': {
                'type': 'IntentRequest',
                'requestId': 'EdwRequestId.b2ffedf2-f1a8-4b74-81da-1c0e12e48bb3',
                'locale': 'en-US',
                'timestamp': '2016-10-30T21:39:11Z',
                'intent': {
                    'name': 'StartGameIntent',
                    'slots': {}
                }
            },
            'version': '1.0'
        };

        index(startGameRequest, mockContext, callbackSpy);

        mockContext.succeed.should.be.calledOnce;
        var result = mockContext.succeed.getCall(0).args[0];

        result.should.containSubset({
            response: EXPECTED_START_GAME_RESPONSE
        });

        should.exist(result.sessionAttributes);
        result.sessionAttributes.should.containSubset({
            stateName: 'PickingFirstCard',
            moveCount: 0,
            cardsRemaining: 12
        });
        expect(result.sessionAttributes.cards).to.exist;

        // should have 4 rows of cards
        result.sessionAttributes.cards.length.should.eql(4);
        // should have 3 columns of cards in each row
        result.sessionAttributes.cards.should.all.have.lengthOf(3);
    });

    test('it should respond to a PickingFirstCardIntent', function(){
        const pickFirstCardRequest = createRequest({
            'cards': [
                [
                    'blue square',
                    'blue square',
                    'red triangle'
                ],
                [
                    'red triangle',
                    'blue square',
                    'pink star'
                ],
                [
                    'green star',
                    'green star',
                    'blue star'
                ],
                [
                    'pink star',
                    'blue star',
                    'blue square'
                ]
            ],
            'stateName': 'PickingFirstCard',
            'cardsRemaining': 12,
            'moveCount': 0,
            'intent': {
                'name': 'PickCardIntent',
                'slots': {
                    'Col': {
                        'name': 'Col',
                        'value': '1'
                    },
                    'Row': {
                        'name': 'Row',
                        'value': '1'
                    }
                }
            }
        });

        index(pickFirstCardRequest, mockContext, callbackSpy);

        mockContext.succeed.should.be.calledOnce;
        var result = mockContext.succeed.getCall(0).args[0];

        result.should.containSubset({
            'response': {
                'outputSpeech': {
                    'type': 'PlainText',
                    'text': 'blue square. Now choose a second card to match it.'
                },
                'reprompt': {
                    'outputSpeech': {
                        'type': 'PlainText',
                        'text': 'You can make a guess like, row 1, column 1, or say exit to stop playing.'
                    }
                },
                'shouldEndSession': false
            }
        });

        should.exist(result.sessionAttributes);
        result.sessionAttributes.should.containSubset({
            stateName: 'PickingSecondCard',
            moveCount: 1,
            cardsRemaining: 12
        });
    });

    test('it should respond to a PickingSecondCardIntent', function(){
        const pickSecondCardRequest = createRequest({
            'cards': [
                [
                    'blue square',
                    'blue square',
                    'red triangle'
                ],
                [
                    'red triangle',
                    'blue square',
                    'pink star'
                ],
                [
                    'green star',
                    'green star',
                    'blue star'
                ],
                [
                    'pink star',
                    'blue star',
                    'blue square'
                ]
            ],
            'firstSelection': {
                'row': 0,
                'col': 0,
                'card': 'blue square'
            },
            'stateName': 'PickingSecondCard',
            'cardsRemaining': 12,
            'moveCount': 1,
            'intent': {
                'name': 'PickCardIntent',
                'slots': {
                    'Col': {
                        'name': 'Col',
                        'value': '2'
                    },
                    'Row': {
                        'name': 'Row',
                        'value': '1'
                    }
                }
            }
        });

        index(pickSecondCardRequest, mockContext, callbackSpy);

        mockContext.succeed.should.be.calledOnce;
        var result = mockContext.succeed.getCall(0).args[0];

        result.should.containSubset({
            'response': {
                'outputSpeech': {
                    'type': 'PlainText',
                    'text': "blue square. That's a match! There are 10 cards remaining. What's your next guess?"
                },
                'reprompt': {
                    'outputSpeech': {
                        'type': 'PlainText',
                        'text': 'You can make a guess like, row 1, column 1, or say exit to stop playing.'
                    }
                },
                'shouldEndSession': false
            }
        });

        should.exist(result.sessionAttributes);
        result.sessionAttributes.should.containSubset({
            stateName: 'PickingFirstCard',
            moveCount: 2,
            cardsRemaining: 10
        });

        expect(result.sessionAttributes.cards[0]).to.eql([
            'X',
            'X',
            'red triangle'
        ]);
    });

    test('it should move to game over on win', function(){
        const pickSecondCardRequest = createRequest({
            'cards': [
                ['X', 'X', 'X'],
                ['X', 'X', 'X'],
                ['X', 'X', 'blue star'],
                ['X','blue star','X']
            ],
            'firstSelection': {
                'row': 2,
                'col': 2,
                'card': 'blue star'
            },
            'stateName': 'PickingSecondCard',
            'cardsRemaining': 2,
            'moveCount': 11,
            'intent': {
                'name': 'PickCardIntent',
                'slots': {
                    'Col': {
                        'name': 'Col',
                        'value': '2'
                    },
                    'Row': {
                        'name': 'Row',
                        'value': '4'
                    }
                }
            }
        });

        index(pickSecondCardRequest, mockContext, callbackSpy);

        mockContext.succeed.should.be.calledOnce;
        var result = mockContext.succeed.getCall(0).args[0];

        result.should.containSubset({
            'response': {
                'outputSpeech': {
                    'type': 'SSML',
                    'ssml': `<speak>blue star. That's a match! You won in just 12 moves!. <break time="1s" />` +
                            `You can start a new game by saying, 'new game', or quit by saying, 'exit'.</speak>`
                },
                'reprompt': {
                    'outputSpeech': {
                        'type': 'SSML',
                        'ssml': "<speak>Would you like to play again? You can answer 'yes' to start a new game or 'no'"+
                                ' to quit.</speak>'
                    }
                },
                'shouldEndSession': false
            }
        });

        should.exist(result.sessionAttributes);
        result.sessionAttributes.should.containSubset({
            stateName: 'GameOver',
            moveCount: 12,
            cardsRemaining: 0
        });

        result.sessionAttributes.cards.should.all.eql(['X','X','X']);
    });

    test('it should start a new game on yes', function(){
        const yesRequest = createRequest({
            'cards': [
                ['X', 'X', 'X'],
                ['X', 'X', 'X'],
                ['X', 'X', 'X'],
                ['X', 'X', 'X']
            ],
            'firstSelection': {
                'row': 2,
                'col': 2,
                'card': 'blue star'
            },
            'stateName': 'GameOver',
            'cardsRemaining': 0,
            'moveCount': 12,
            'intentName': 'AMAZON.YesIntent'
        });

        index(yesRequest, mockContext, callbackSpy);

        mockContext.succeed.should.be.calledOnce;
        var result = mockContext.succeed.getCall(0).args[0];

        result.should.containSubset({
            'response': {
                'outputSpeech': {
                    'type': 'PlainText',
                    'text': "Ok, new game ready.  What's your first card?"
                },
                'reprompt': {
                    'outputSpeech': {
                        'type': 'PlainText',
                        'text': 'You can start guessing by saying, row 1, column 1, or exit to stop playing.'
                    }
                },
                'shouldEndSession': false
            }
        });

        should.exist(result.sessionAttributes);
        result.sessionAttributes.should.containSubset({
            stateName: 'PickingFirstCard',
            moveCount: 0,
            cardsRemaining: 12
        });
        should.not.exist(result.sessionAttributes.firstSelection);

        result.sessionAttributes.cards.should.all.not.eql(['X','X','X']);
    });

    test('it should exit on no', function(){
        const noRequest = createRequest({
            'cards': [
                ['X', 'X', 'X'],
                ['X', 'X', 'X'],
                ['X', 'X', 'X'],
                ['X', 'X', 'X']
            ],
            'firstSelection': {
                'row': 2,
                'col': 2,
                'card': 'blue star'
            },
            'stateName': 'GameOver',
            'cardsRemaining': 0,
            'moveCount': 12,
            'intentName': 'AMAZON.NoIntent'
        });

        index(noRequest, mockContext, callbackSpy);

        mockContext.succeed.should.be.calledOnce;
        var result = mockContext.succeed.getCall(0).args[0];

        result.should.containSubset({
            'response': {
                'outputSpeech': {
                    'type': 'PlainText',
                    'text': 'Goodbye.'
                },
                'shouldEndSession': true
            }
        });
    });

    function createRequest(values){
        return {
            'session': {
                'sessionId': 'SessionId.c8c73211-2ccd-446d-9374-81298888ff05',
                'application': {
                    'applicationId': 'amzn1.ask.skill.a224d45d-3af6-42ab-a6d5-6f6d029d7932'
                },
                'attributes': {
                    'cards': values.cards || [
                        [
                            'X',
                            'X',
                            'X'
                        ],
                        [
                            'X',
                            'X',
                            'X'
                        ],
                        [
                            'X',
                            'X',
                            'X'
                        ],
                        [
                            'X',
                            'X',
                            'X'
                        ]
                    ],
                    'firstSelection': values.firstSelection,
                    'stateName': values.stateName || 'GameOver',
                    'cardsRemaining': values.cardsRemaining || 0,
                    'moveCount': values.moveCount || 0
                },
                'user': {
                    'userId': 'amzn1.ask.account.AFWDXWUEUYBQPDHYHZPUANTX2KKMVQQC4LNTA24AZ4AJFQV4TAXCROGTQX5JNUEEQUAD' +
                        'CLGV6P74TKFVUH4DUEGJNLHFYS7CKXY5UBEB5VRYPVTQFJU76ZDF2C3PAV5KSJMDZDNAKF2FON2N3XMILOD56UGLYJWU' +
                        '2PN7QJFOCRVJTABK4I5TTGBNFYSBAKSZIPMVNQXKJUQBCFI'
                },
                'new': (typeof values.new === 'boolean') ? values.new : false
            },
            'request': {
                'type': 'IntentRequest',
                'requestId': 'EdwRequestId.30575203-ba5c-4d3c-8103-a6ca028d2707',
                'locale': 'en-US',
                'timestamp': '2016-10-31T04:49:07Z',
                'intent': values.intent || {
                    'name': values.intentName || 'AMAZON.YesIntent',
                    'slots': {}
                }
            },
            'version': '1.0'
        };

    }
});
