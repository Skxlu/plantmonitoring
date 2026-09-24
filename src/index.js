export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        // =========================
        // ESP32 -> POST /api/sensor
        // =========================

        if (
            url.pathname === "/api/sensor" &&
            request.method === "POST"
        ) {

            try {

                const data = await request.json();

                const moisture = Number(data.moisture);
                const adc = Number(data.adc);

                if (
                    !Number.isFinite(moisture) ||
                    !Number.isFinite(adc)
                ) {
                    return Response.json(
                        {
                            error: "Ungültige Daten"
                        },
                        {
                            status: 400
                        }
                    );
                }

                await env.DB
                    .prepare(
                        `
                        INSERT INTO measurements
                        (moisture, adc)
                        VALUES (?, ?)
                        `
                    )
                    .bind(moisture, adc)
                    .run();

                return Response.json({
                    success: true
                });

            } catch (error) {

                return Response.json(
                    {
                        error: error.message
                    },
                    {
                        status: 500
                    }
                );

            }
        }


        // =========================
        // Website -> GET /api/measurements
        // =========================

        if (
            url.pathname === "/api/measurements" &&
            request.method === "GET"
        ) {

            try {

                const result = await env.DB
                    .prepare(
                        `
                        SELECT
                            id,
                            moisture,
                            adc,
                            created_at
                        FROM measurements
                        ORDER BY id DESC
                        LIMIT 50
                        `
                    )
                    .all();

                return Response.json(
                    result.results,
                    {
                        headers: {
                            "Cache-Control": "no-store"
                        }
                    }
                );

            } catch (error) {

                return Response.json(
                    {
                        error: error.message
                    },
                    {
                        status: 500
                    }
                );

            }
        }


        // =========================
        // Website ausliefern
        // =========================

        return env.ASSETS.fetch(request);
    }
};