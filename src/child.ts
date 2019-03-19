import { exec as Exec } from 'child_process';

// Spawn a child process to the CLI and parse stdout as json
export function exec<T>(cwd: string, ...params: string[]) {
    return new Promise<T>((resolve, reject) => {
        Exec(params.join(' '), { cwd }, (err, stdout, stderr) => {
            console.log(stdout);
            if (err) {
                throw err;
            }
            try {
                const response: T = JSON.parse(stdout);
                return resolve(response);
            } catch (err) {
                throw err;
            }
        });
    })
}