import pkg from 'enquirer';
const { Input } = pkg;

import * as conf from './config.json' assert {type: 'json'};
import { logger, readFromConfig, getAllFiles, importCategory, resetCategoryObj} from './helper.js';
import initScheduler from './scheduler.js';

const aidaInit = async () => {
    resetCategoryObj();

    logger.info(`Display config file contents: ${JSON.stringify(readFromConfig(conf.default.aida))}${JSON.stringify(readFromConfig(conf.default.calendar))}`);
    const categoryDir = readFromConfig(conf.default.aida.categoryDirectory);
    const categories = getAllFiles(categoryDir);

    try {
        if (readFromConfig(conf.default.aida.singleFile)) {
            let categoryDir = readFromConfig(conf.default.aida.categoryDirectory);
            let singleFile = readFromConfig(conf.default.aida.singleFile);
            importCategory(`${__dirname}\\${categoryDir}\\${singleFile}`);
        }
    } catch {
        for (let x = 0; x < categories.length; x++) {
            importCategory(categories[x]);
            logger.info(`Successfully imported tweet category from: ${categories[x]}! Let's start tweeting!`);
        }
    }

    initScheduler();

    if (readFromConfig(conf.default.aida.requireFinalApproval)) {
        const askFinalApproval = new Input({
            approval: 'y',
            message: 'Can we post the following tweets?'
        });
        const choice = await askFinalApproval.run();

        if (choice == 'n') aidaInit();
        if (choice == 'y') logger.info('Great! Aida will begin posting using the above schedule! Leave the rest to her! 🤩');
    }
}

// TODO: Once Aida has finished, she should automatically restart.
aidaInit();