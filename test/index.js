/* global describe, it */
'use strict';

// Load dependencies
var should = require('should');
var Query  = require('bazalt-query');

// Class to test
var Translator = require('../');


describe('Test Translator class', function() {

    it('Translator for an invalid Query', function(){

        should(function() {
            new Translator();
        }).throw();

        should(function() {
            new Translator(null);
        }).throw();

        should(function() {
            new Translator(new Date());
        }).throw();
    });

    it('Translator for a .find() Query', function(){
        var query = new Query();

        query.find();

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ??'
        );
    });

    it('Translator for a .findOne(empty) Query', function(){
        var query = new Query();

        query.findOne();

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? LIMIT 0, ?'
        );
    });

    it('Translator for a .findOne(criteria) Query', function(){
        var query = new Query();

        query.findOne({
            name: 'test'
        });

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? WHERE ? LIMIT 0, ?'
        );
    });

    it('Translator for a .findOne(criteria) and .offset() Query', function(){
        var query = new Query();

        query.findOne({
            name: 'test'
        })
        .offset(10);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? WHERE ? LIMIT ?, ?'
        );
    });

    it('Translator for a .find(criteria) Query', function(){
        var query = new Query();

        query.find({
            name: 'test'
        });

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? WHERE ?'
        );
    });

    it('Translator for a .find(multiple criteria) Query', function(){
        var query = new Query();

        query.find({
            lastname:  'john',
            firstname: 'doe',
            age:       42
        });

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? WHERE ? AND ? AND ?'
        );
    });

    it('Translator for a .find() and .sort() DESC Query', function(){
        var query = new Query();

        query
            .find()
            .sort('age', -1);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? ORDER BY ?? DESC'
        );
    });

    it('Translator for a .find() and .sort() ASC Query', function(){
        var query = new Query();

        query
            .find()
            .sort('age', 1);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? ORDER BY ?? ASC'
        );
    });

    it('Translator for a .find() and multiple .sort() Query', function(){
        var query = new Query();

        query
            .find()
            .sort('firstname', 1)
            .sort('lastname', 1)
            .sort('age', -1);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? ORDER BY ?? ASC, ?? ASC, ?? DESC'
        );
    });

    it('Translator for a .find(empty) and .limit() Query', function(){
        var query = new Query();

        query.find()
            .limit(2);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? LIMIT 0, ?'
        );
    });

    it('Translator for a .find(criteria) and .limit() Query', function(){
        var query = new Query();

        query.find({
            name: 'test'
        })
        .limit(2);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? WHERE ? LIMIT 0, ?'
        );
    });

    it('Translator for a .find(empty), .limit() and .offset() Query', function(){
        var query = new Query();

        query.find()
        .limit(2)
        .offset(10);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? LIMIT ?, ?'
        );
    });

    it('Translator for a .find(criteria), .limit() and .offset() Query', function(){
        var query = new Query();

        query.find({
            name: 'test'
        })
        .limit(2)
        .offset(10);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? WHERE ? LIMIT ?, ?'
        );
    });

    it('Translator for a .find(criteria), .limit() and .offset() and .sort() Query', function(){
        var query = new Query();

        query.find({
            name: 'test'
        })
        .limit(2)
        .offset(10)
        .sort('name', -1);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'SELECT * FROM ?? WHERE ? ORDER BY ?? DESC LIMIT ?, ?'
        );
    });


    it('Translator for a .create() Query', function(){
        var query = new Query();

        query.create({
            name: 'test'
        });

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'INSERT INTO ?? SET ?'
        );
    });

    it('Translator for a .update() Query', function(){
        var query = new Query();

        query.update({
            name: 'test'
        }, {
            name: 'rename'
        });

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'UPDATE ?? SET ? WHERE ?'
        );
    });

    it('Translator for a .update() and .limit() Query', function(){
        var query = new Query();

        query.update({
            name: 'test'
        }, {
            name: 'rename'
        })
        .limit(2);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'UPDATE ?? SET ? WHERE ? LIMIT 0, ?'
        );
    });

    it('Translator for a .update(), .limit() and .offset() Query', function(){
        var query = new Query();

        query.update({
            name: 'test'
        }, {
            name: 'rename'
        })
        .limit(2)
        .offset(10);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'UPDATE ?? SET ? WHERE ? LIMIT ?, ?'
        );
    });

    it('Translator for a .destroy() Query', function(){
        var query = new Query();

        query.destroy({
            name: 'test'
        });

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'DELETE FROM ?? WHERE ?'
        );
    });

    it('Translator for a .destroy() and .limit() Query', function(){
        var query = new Query();

        query.destroy({
            name: 'test'
        })
        .limit(2);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'DELETE FROM ?? WHERE ? LIMIT 0, ?'
        );
    });

    it('Translator for a .destroy(), .limit() and .offset() Query', function(){
        var query = new Query();

        query.destroy({
            name: 'test'
        })
        .limit(2)
        .offset(10);

        var translator = new Translator(query);

        should.equal(
            translator.sql,
            'DELETE FROM ?? WHERE ? LIMIT ?, ?'
        );
    });
});