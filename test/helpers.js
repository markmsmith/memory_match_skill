import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';
import chaiThings from 'chai-things';

/* This file takes care of any common setup / imports for the tests and is pulled in by mocha.opts */

// add 'should()' to object prototype and the object to globals for use in should.not.exist(nullValue)
global.should = chai.should();
global.expect = chai.expect;

// include stack trace in error messages
chai.config.includeStack = true;

// setup chai assertions for sinon
chai.use(sinonChai);

// setup support for partial properties comparision in obj.should.containSubset(a: 1, c: 3)
chai.use(chaiSubset);

// setup support for checking all array items match condition in arr.should.all.have.property('id')
chai.use(chaiThings);
