// tslint:disable: no-unused-expression

import {expect} from 'chai';
import 'mocha';
import {BitChain} from './../src/lib/Chromosome';
import {
  NaiveFlipBitMutation,
  SerieFlipBitMutation,
  FlipBitMutation,
} from './../src/lib/Mutation';
import {timerFunction} from './../src/lib/Helpers';
import _ from 'lodash';

describe('Mutation Strategies', () => {
  describe('Serie Flip Bit Mutation', () => {
    let chain: BitChain;
    beforeEach(() => {
      chain = '0000';
    });

    it('should mutate a chain', () => {
      const M = new SerieFlipBitMutation();
      M._nextMutationCounter = 3;
      const c = M.mutation(chain);
      expect(c).to.equal('0001');
    });

    it('should create a chain of bits', () => {
      const M = new FlipBitMutation();
      const c = M.mutation(chain);
      c.split('').forEach((char) => {
        expect(char).to.be.satisfy((s: string) => s === '0' || '1');
      });
    });

    it('should not mutate in place', () => {
      const M = new FlipBitMutation();
      const nChain = '01'.repeat(1000);
      const clone = _.clone(nChain);
      M.mutation(nChain);
      expect(clone).to.deep.equal(nChain);
    });

    it('should create a chain of same length than the one given', () => {
      const M = new FlipBitMutation();
      const nChain = '01'.repeat(1000);
      const c = M.mutation(nChain);
      expect(nChain).to.be.lengthOf(c.length);
    });

    it('should be more efficicent than naive strategy for small probability p=0.1', () => {
      const p = 0.1;
      const ITERATIONS = 10000;
      const nChain = '0110101000100010101010001000100010';
      const flipBit = new SerieFlipBitMutation(p);
      const naive = new NaiveFlipBitMutation(p);

      // Flip Bit
      const flipBitTime = timerFunction(() => {
        flipBit.mutation(nChain);
      }, ITERATIONS);

      // Naive Flip Bit
      const naiveTime = timerFunction(() => {
        naive.mutation(nChain);
      }, ITERATIONS);

      // Display
      // console.log('flipBit time is ', flipBitTime);
      // console.log('naive time is ', naiveTime);

      expect(naiveTime).to.be.above(flipBitTime);
    });

    it('should be less efficicent than naive strategy for high probability p=0.5', () => {
      const p = 0.5;
      const ITERATIONS = 30000;
      const nChain = '0110101000100010101010001000100010';
      const flipBit = new SerieFlipBitMutation(p);
      const naive = new NaiveFlipBitMutation(p);

      // Flip Bit
      const flipBitTime = timerFunction(() => {
        flipBit.mutation(nChain);
      }, ITERATIONS);

      // Naive Flip Bit
      const naiveTime = timerFunction(() => {
        naive.mutation(nChain);
      }, ITERATIONS);

      // Display
      // console.log('flipBit time is ', flipBitTime);
      // console.log('naive time is ', naiveTime);

      expect(flipBitTime).to.be.above(naiveTime);
    });

    it('should be roughly ( 30% close ) the same efficiency for probability p=0.3', () => {
      const p = 0.3;
      const ITERATIONS = 10000;
      const nChain = '0110101000100010101010001000100010';
      const flipBit = new SerieFlipBitMutation(p);
      const naive = new NaiveFlipBitMutation(p);

      // Flip Bit
      const flipBitTime = timerFunction(() => {
        flipBit.mutation(nChain);
      }, ITERATIONS);

      // Naive Flip Bit
      const naiveTime = timerFunction(() => {
        naive.mutation(nChain);
      }, ITERATIONS);

      // Display
      const percentage = (a: number, b: number) => Math.abs(a / b) * 100;
      const delta = percentage(flipBitTime, naiveTime);
      // console.log('delta is', delta);

      expect(delta).to.be.above(70);
      expect(delta).to.be.lessThan(130);
    });
  });
});