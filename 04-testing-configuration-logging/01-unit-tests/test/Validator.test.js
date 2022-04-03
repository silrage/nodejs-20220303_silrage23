const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      // Min
      const errors = validator.validate({ name: 'Lalala' });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');

      // Max
      const errorsMax = validator.validate({name: 'Lalala la la laaa la la'});
      expect(errorsMax).to.have.length(1);
      expect(errorsMax[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsMax[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 23');
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 14,
          max: 65,
        },
      });

      // Min
      const errors = validator.validate({age: 12});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 14, got 12');

      // Max
      const errorsMax = validator.validate({age: 66});
      expect(errorsMax).to.have.length(1);
      expect(errorsMax[0]).to.have.property('field').and.to.be.equal('age');
      expect(errorsMax[0]).to.have.property('error').and.to.be.equal('too big, expect 65, got 66');
    });

    it('валидатор проверяет наличие объекта данных', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 20,
        },
      });

      const error = validator.validate();
      expect(error).to.be.equal('expect object with data');
    });

    it('валидатор проверяет комбинирование типов', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 20,
        },
        age: {
          type: 'number',
          min: 14,
          max: 65,
        },
      });

      const error = validator.validate({name: 'C', age: 11});
      expect(error).to.have.length(2);
      expect(error[0]).to.have.property('field').and.to.be.equal('name');
      expect(error[0]).to.have.property('error').and.to.be.equal('too short, expect 2, got 1');
      expect(error[1]).to.have.property('field').and.to.be.equal('age');
      expect(error[1]).to.have.property('error').and.to.be.equal('too little, expect 14, got 11');
    });
  });
});
