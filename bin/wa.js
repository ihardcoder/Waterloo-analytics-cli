#!/usr/bin/env node

const program = require('commander');
const fsp = require('fs-promise');
const fs = require('fs');
const path = require('path');
const promptly = require('promptly');
var child_process = require('child_process');

program.version('0.0.1');
// init命令，初始化Waterloo Analytic项目
program.command('init [dir]')
    .description('download waterloo analytics sourecode and init')
    .action(function(dir) {
        const _dir = path.join(__dirname, '../node_modules/waterloo_analytics');
        if (!dir || dir === '/') {
            dir = './';
        }

        console.log('Initializing...');
        fsp.readdir(dir).then(function(files) {
            if (files) {
                promptly.choose('The action will wipe all data of the dir,are you sure to do this?(y/n)', ['yes', 'y', 'no', 'n'], function(err, value) {
                    // prompt if the sepecific dir is not empty
                    if (value === 'y' || value === 'yes') {
                        fsp.emptydir(dir).then(function() {
                            fsp.copy(_dir, dir);
                        }).then(function() {
                            console.log('Initialized Successfully!');
                        });
                    } else {
                        console.log('The action is interrupted!');
                        // exit the process if user choose 'n' or 'no'
                        process.exit();
                    }
                });
            } else {
                fsp.mkdirs(dir).then(function() {
                    fsp.copy(_dir, dir);
                }).then(function() {
                    console.log('Initialized Successfully!');
                });
            }
        });
    });
// build命令
program.command('build')
    .description('build waterloo analytics')
    .action(function() {
        fs.stat('./build/build.js', function(err, stat) {
            if (stat && stat.isFile()) {
                child_process.exec('npm run build', function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('Builded Successfully!');
                });
            } else {
                throw new Error('Invalid project');
            }
        });
    });

program.parse(process.argv);