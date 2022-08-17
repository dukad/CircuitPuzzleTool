export default function SendToPython(path, string) {
    const spawner = require('child process').spawn

    const python_process = spawner('python', [path, string]);

    python_process.stdout.on('data', (data) => {
        console.log(data.toString())
    })
}
